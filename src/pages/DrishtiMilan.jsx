import React, { useState, useEffect, useRef } from 'react';
import { Video, Phone, PhoneOff, Mic, MicOff, Camera, CameraOff, ArrowLeftRight } from 'lucide-react';
import io from 'socket.io-client';
import PageBackground from '../Components/layout/PageBackground';
import { Button } from '../Components/ui/Button';

const socket = io.connect("http://localhost:5001");

// Regional styles for cultural borders
const REGIONAL_STYLES = {
    'West Bengal': { border: '3px solid #f59e0b', greeting: 'Nomoshkar 🙏' },
    'Maharashtra': { border: '3px solid #FF9933', greeting: 'Namaskar 🙏' },
    'Tamil Nadu': { border: '3px solid #FFD700', greeting: 'Vanakkam 🙏' },
    'Kerala': { border: '3px solid #228B22', greeting: 'Namaskaram 🙏' },
    'Punjab': { border: '3px solid #FF9933', greeting: 'Sat Sri Akal 🙏' },
    'Rajasthan': { border: '3px solid #FF4500', greeting: 'Khamma Ghani 🙏' },
    'Gujarat': { border: '3px solid #FF6347', greeting: 'Kem Cho 🙏' },
    'Karnataka': { border: '3px solid #DC143C', greeting: 'Namaskara 🙏' },
    'default': { border: '3px solid #f59e0b', greeting: 'Namaste 🙏' }
};

const DrishtiMilan = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [inCall, setInCall] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [callPurpose, setCallPurpose] = useState('');
    const [showPurposeModal, setShowPurposeModal] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [showGreeting, setShowGreeting] = useState(false);
    const [remoteUserInfo, setRemoteUserInfo] = useState(null);
    const [videosSwapped, setVideosSwapped] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [liveSubtitle, setLiveSubtitle] = useState('');
    const [isListening, setIsListening] = useState(false);

    // WebRTC refs
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);
    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteSocketIdRef = useRef(null);

    useEffect(() => {
        if (user) {
            socket.emit('join_room', {
                room: 'global',
                userName: user.name,
                userId: user._id  // Send database ID for mapping
            });
        }

        socket.emit('request_user_count');

        socket.on('update_online_users', (users) => {
            const uniqueUsers = [...new Set(users)];
            setOnlineUsers(uniqueUsers.filter(u => u !== user?.name));
        });

        socket.on('incoming_video_call', (data) => {
            console.log("🔥 FRONTEND RECEIVED CALL:", data);
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2860/2860-preview.mp3');
            audio.play().catch(e => console.log("Audio play failed", e));
            setIncomingCall(data);
        });

        socket.on('call_declined', () => {
            alert('Call was declined');
            setIsCalling(false);
            setShowPurposeModal(false);
            setSelectedUser(null);
            setLiveSubtitle('');
            setIsListening(false);
            setVideosSwapped(false);
        });

        socket.on('call_accepted', (data) => {
            console.log('✅ Call accepted! Receiver:', data);
            remoteSocketIdRef.current = data.receiverSocketId;

            // Store remote user info
            setRemoteUserInfo({
                name: data.receiverName,
                location: data.receiverLocation,
                language: data.receiverLanguage
            });

            // Hide calling overlay, show video UI
            setIsCalling(false);
            setInCall(true);
            setShowGreeting(true);
            setTimeout(() => setShowGreeting(false), 3000);

            // Start WebRTC
            initiateCall(data.receiverSocketId);
        });

        // WebRTC Signaling
        socket.on('webrtc_offer', async (data) => {
            console.log('Received WebRTC offer');
            remoteSocketIdRef.current = data.from;
            await handleOffer(data.offer, data.from);
        });

        socket.on('webrtc_answer', async (data) => {
            console.log('Received WebRTC answer');
            await handleAnswer(data.answer);
        });

        socket.on('ice_candidate', async (data) => {
            console.log('Received ICE candidate');
            await handleIceCandidate(data.candidate);
        });

        socket.on('call_ended', () => {
            endCall();
        });

        return () => {
            socket.off('update_online_users');
            socket.off('incoming_video_call');
            socket.off('call_declined');
            socket.off('call_accepted');
            socket.off('webrtc_offer');
            socket.off('webrtc_answer');
            socket.off('ice_candidate');
            socket.off('call_ended');
        };
    }, []);

    const callPurposes = [
        { id: 'craft', label: '🎨 Learn a Craft', icon: '🎨' },
        { id: 'project', label: '🤝 Collaborate on Project', icon: '🤝' },
        { id: 'culture', label: '💬 Cultural Exchange', icon: '💬' },
        { id: 'other', label: '✨ Other', icon: '✨' }
    ];

    const handleCallClick = (targetUser) => {
        const accountAge = Date.now() - new Date(user.createdAt);
        const sevenDays = 7 * 24 * 60 * 60 * 1000;

        if (!user.isVerified) {
            alert('❌ Please verify your email before making video calls');
            return;
        }

        if (accountAge < sevenDays) {
            alert('❌ Your account must be at least 7 days old to make video calls');
            return;
        }

        setSelectedUser(targetUser);
        setShowPurposeModal(true);
    };

    const sendCallRequest = () => {
        if (!callPurpose) {
            alert('Please select a call purpose');
            return;
        }

        socket.emit('send_video_call_request', {
            from: user.name,
            fromId: user._id,
            fromRegion: user.location,
            fromLanguage: user.language,
            to: selectedUser,
            purpose: callPurpose
        });

        setShowPurposeModal(false);
        setIsCalling(true); // Show calling overlay
    };

    const acceptCall = async () => {
        console.log('Accepting call...');

        // Store caller's info as remote user
        setRemoteUserInfo({
            name: incomingCall.from,
            location: incomingCall.fromRegion,
            language: incomingCall.fromLanguage
        });

        socket.emit('accept_video_call', {
            callerId: incomingCall.fromId,
            receiverName: user.name,
            receiverLocation: user.location,
            receiverLanguage: user.language
        });

        setIncomingCall(null);
        setInCall(true);
        setShowGreeting(true);
        setTimeout(() => setShowGreeting(false), 3000);

        await startLocalVideo();
    };

    const declineCall = () => {
        socket.emit('decline_video_call', {
            callerId: incomingCall.fromId
        });
        setIncomingCall(null);
    };

    // ============ WebRTC Functions ============

    const startLocalVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });
            localStreamRef.current = stream;
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('Could not access camera/microphone. Please check permissions.');
        }
    };

    const createPeerConnection = () => {
        const configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' }
            ]
        };

        const pc = new RTCPeerConnection(configuration);

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit('ice_candidate', {
                    target: remoteSocketIdRef.current,
                    candidate: event.candidate
                });
            }
        };

        pc.ontrack = (event) => {
            console.log('Received remote stream');
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = event.streams[0];
            }
        };

        return pc;
    };

    const initiateCall = async (targetSocketId) => {
        console.log('Initiating call to', targetSocketId);

        const stream = await startLocalVideo();
        if (!stream) return;

        const pc = createPeerConnection();
        peerConnectionRef.current = pc;

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        socket.emit('webrtc_offer', {
            target: targetSocketId,
            offer: offer
        });
    };

    const handleOffer = async (offer, from) => {
        console.log('Handling offer from', from);
        setInCall(true);
        setShowGreeting(true);
        setTimeout(() => setShowGreeting(false), 3000);

        const stream = await startLocalVideo();
        if (!stream) return;

        const pc = createPeerConnection();
        peerConnectionRef.current = pc;

        stream.getTracks().forEach(track => {
            pc.addTrack(track, stream);
        });

        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('webrtc_answer', {
            target: from,
            answer: answer
        });
    };

    const handleAnswer = async (answer) => {
        if (peerConnectionRef.current) {
            await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
    };

    const handleIceCandidate = async (candidate) => {
        if (peerConnectionRef.current) {
            await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
    };

    const toggleMute = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsMuted(!isMuted);
        }
    };

    const toggleCamera = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = !track.enabled;
            });
            setIsCameraOff(!isCameraOff);
        }
    };

    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }

        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
        }

        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }

        socket.emit('end_video_call', { target: remoteSocketIdRef.current });

        setInCall(false);
        setIsMuted(false);
        setIsCameraOff(false);
        peerConnectionRef.current = null;
        localStreamRef.current = null;
        remoteSocketIdRef.current = null;
        setRemotePeer(null);
    };

    const swapVideos = () => {
        setVideosSwapped(!videosSwapped);
    };

    const reportUser = () => {
        if (!remoteUserInfo) return;

        // Send report to server
        socket.emit('report_user', {
            reportedUserId: remoteUserInfo.id,
            reportedName: remoteUserInfo.name,
            reporterName: user.name,
            timestamp: new Date().toISOString()
        });

        alert(`✅ Reported ${remoteUserInfo.name}. They have been blocked.`);
        setShowReportModal(false);
        endCall();
    };

    const getRegionalStyle = (location) => {
        return REGIONAL_STYLES[location] || REGIONAL_STYLES['default'];
    };

    return (
        <PageBackground>
            <div className="min-h-screen pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="max-w-7xl mx-auto mb-8">
                    <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-3">
                        DRISHTI-MILAN (दृष्टि-मिलन)
                    </h1>
                    <p className="text-gray-300 text-lg">Secure video calls with cultural features • Connect across states</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar - Online Users */}
                    <div className="lg:col-span-1">
                        <div className="retro-card p-6">
                            <h2 className="text-xl font-display font-bold text-white mb-4 flex items-center gap-2">
                                <span className="w-3 h-3 bg-unity-saffron rounded-full animate-pulse"></span>
                                ONLINE USERS ({onlineUsers.length})
                            </h2>
                            <p className="text-sm text-gray-400 mb-4">Other users online • Click to call</p>
                            <div className="space-y-3">
                                {onlineUsers.map((onlineUser, index) => (
                                    <div
                                        key={index}
                                        onClick={() => !inCall && handleCallClick(onlineUser)}
                                        className={`p-4 bg-white/5 border border-white/10 rounded-lg transition-all ${!inCall ? 'hover:border-unity-saffron hover:bg-white/10 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-unity-indigo rounded-full flex items-center justify-center text-white font-display font-bold">
                                                    {onlineUser[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">{onlineUser}</p>
                                                    <p className="text-xs text-unity-saffron flex items-center gap-1">
                                                        <span className="w-2 h-2 bg-unity-saffron rounded-full"></span>
                                                        Online
                                                    </p>
                                                </div>
                                            </div>
                                            {!inCall && (
                                                <Video className="w-5 h-5 text-unity-saffron" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {onlineUsers.length === 0 && (
                                    <p className="text-gray-400 text-center py-8">No other users online</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Video Area */}
                    <div className="lg:col-span-3">
                        {!inCall ? (
                            <div className="retro-card p-12 text-center min-h-[600px] flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-unity-saffron rounded-full flex items-center justify-center mb-6">
                                    <Video className="w-12 h-12 text-black" />
                                </div>
                                <h2 className="text-3xl font-display font-bold text-white mb-4">Welcome to Drishti-Milan</h2>
                                <p className="text-gray-300 mb-8 max-w-md">
                                    Connect with users from different states through video calls
                                </p>
                                <div className="bg-white/5 border border-white/10 rounded-lg p-6 max-w-lg">
                                    <h3 className="text-unity-saffron font-display font-bold mb-4">Unique Features:</h3>
                                    <ul className="text-left text-gray-300 space-y-2">
                                        <li>✓ Regional cultural borders</li>
                                        <li>✓ Cultural greeting animations</li>
                                        <li>✓ Purpose-tagged calls (safe environment)</li>
                                        <li>✓ Verified users only</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="retro-card p-6 video-call-container">
                                {/* Cultural Greeting Overlay */}
                                {showGreeting && (
                                    <div className="mb-6 bg-unity-indigo/90 px-8 py-6 rounded-lg border-2 border-unity-saffron text-center animate-pulse">
                                        <p className="text-4xl font-display font-bold text-white">
                                            {getRegionalStyle(user?.location).greeting}
                                        </p>
                                    </div>
                                )}

                                {/* Video Grid */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    {/* Remote Video (or Local if swapped) */}
                                    <div
                                        className="relative aspect-video rounded-lg overflow-hidden bg-unity-dark"
                                        style={{ border: getRegionalStyle(user?.location).border }}
                                    >
                                        <video
                                            ref={videosSwapped ? localVideoRef : remoteVideoRef}
                                            autoPlay
                                            playsInline
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded-full text-white text-sm font-semibold">
                                            {videosSwapped ? `You (${user?.name})` : (remoteUserInfo ? remoteUserInfo.name : 'Remote User')}
                                        </div>
                                        {(videosSwapped ? user?.location : remoteUserInfo?.location) && (
                                            <div className="absolute top-3 right-3 bg-unity-indigo px-3 py-1 rounded-full text-white text-sm font-bold">
                                                📍 {videosSwapped ? user.location : remoteUserInfo.location}
                                            </div>
                                        )}
                                        {(videosSwapped ? user?.language : remoteUserInfo?.language) && (
                                            <div className="absolute top-14 right-3 bg-unity-saffron px-3 py-1 rounded-full text-black text-xs font-bold">
                                                🗣️ {videosSwapped ? (user.language || 'Hindi') : remoteUserInfo.language}
                                            </div>
                                        )}
                                    </div>

                                    {/* Local Video (or Remote if swapped) */}
                                    <div
                                        className="relative aspect-video rounded-lg overflow-hidden bg-unity-dark"
                                        style={{ border: getRegionalStyle(videosSwapped ? remoteUserInfo?.location : user?.location).border }}
                                    >
                                        <video
                                            ref={videosSwapped ? remoteVideoRef : localVideoRef}
                                            autoPlay
                                            muted={!videosSwapped}
                                            playsInline
                                            className="w-full h-full object-cover scale-x-[-1]"
                                        />
                                        <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1.5 rounded-full text-white text-sm font-semibold">
                                            {videosSwapped ? (remoteUserInfo ? remoteUserInfo.name : 'Remote User') : `You (${user?.name})`}
                                        </div>
                                        <div className="absolute top-3 right-3 bg-unity-saffron px-3 py-1 rounded-full text-black text-sm font-bold">
                                            📍 {videosSwapped ? remoteUserInfo?.location : user?.location}
                                        </div>
                                        <div className="absolute top-14 right-3 bg-unity-indigo px-3 py-1 rounded-full text-white text-xs font-bold">
                                            🗣️ {videosSwapped ? (remoteUserInfo?.language || 'Hindi') : (user?.language || 'Hindi')}
                                        </div>
                                    </div>
                                </div>

                                {/* Subtitle Overlay */}
                                {liveSubtitle && (
                                    <div className="bg-black/80 backdrop-blur-sm px-6 py-3 rounded-lg border border-unity-saffron text-center mb-4">
                                        <p className="text-white text-lg font-semibold">{liveSubtitle}</p>
                                    </div>
                                )}

                                {/* Controls */}
                                <div className="flex items-center justify-center gap-3">
                                    <button
                                        onClick={toggleMute}
                                        className={`retro-btn ${isMuted ? 'bg-red-600 text-white' : 'bg-white/10 text-white border-white/20'} border-2`}
                                    >
                                        {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                    </button>

                                    <button
                                        onClick={toggleCamera}
                                        className={`retro-btn ${isCameraOff ? 'bg-red-600 text-white' : 'bg-white/10 text-white border-white/20'} border-2`}
                                    >
                                        {isCameraOff ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                                    </button>

                                    <button
                                        onClick={swapVideos}
                                        className={`retro-btn ${videosSwapped ? 'bg-unity-saffron text-black' : 'bg-white/10 text-white border-white/20'} border-2`}
                                        title="Swap Video Positions"
                                    >
                                        <ArrowLeftRight className="w-5 h-5" />
                                    </button>

                                    <button
                                        onClick={() => setShowReportModal(true)}
                                        className="retro-btn bg-orange-600 text-white border-2 border-orange-800"
                                        title="Report User"
                                    >
                                        🚫
                                    </button>

                                    <button
                                        onClick={endCall}
                                        className="retro-btn bg-red-600 text-white border-2 border-red-800"
                                    >
                                        <PhoneOff className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Call Purpose Modal */}
                {showPurposeModal && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="retro-card p-8 max-w-md w-full">
                            <h3 className="text-2xl font-display font-bold text-white mb-6">📞 Select Call Purpose</h3>
                            <div className="space-y-3 mb-6">
                                {callPurposes.map((purpose) => (
                                    <button
                                        key={purpose.id}
                                        onClick={() => setCallPurpose(purpose.id)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${callPurpose === purpose.id
                                            ? 'border-unity-saffron bg-unity-saffron/20'
                                            : 'border-white/20 bg-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <span className="text-white font-semibold">{purpose.label}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPurposeModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="accent"
                                    onClick={sendCallRequest}
                                    className="flex-1"
                                >
                                    Send Request
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Calling Overlay */}
                {isCalling && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="retro-card p-10 max-w-md w-full text-center">
                            <div className="w-24 h-24 bg-unity-saffron rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                                <Phone className="w-12 h-12 text-black" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white mb-2">Calling {selectedUser}...</h3>
                            <p className="text-gray-300 mb-6">Waiting for {selectedUser} to accept</p>
                            <Button
                                variant="outline"
                                onClick={() => setIsCalling(false)}
                                className="bg-red-600 hover:bg-red-700 text-white border-red-800"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                {/* Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="retro-card p-8 max-w-md w-full text-center border-2 border-red-600">
                            <h3 className="text-2xl font-display font-bold text-white mb-4">⚠️ Report User</h3>
                            <p className="text-gray-300 mb-6">
                                Are you sure you want to report <span className="text-unity-saffron font-bold">{remoteUserInfo?.name}</span>?
                                They will be blocked from calling you.
                            </p>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowReportModal(false)}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="accent"
                                    onClick={reportUser}
                                    className="flex-1 bg-red-600 hover:bg-red-700 border-red-800"
                                >
                                    Report & Block
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Incoming Call Modal */}
                {incomingCall && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="retro-card p-10 max-w-lg w-full border-2 border-unity-saffron">
                            <div className="text-center mb-8">
                                <div className="w-24 h-24 bg-unity-saffron rounded-full mx-auto mb-6 flex items-center justify-center">
                                    <Phone className="w-12 h-12 text-black animate-bounce" />
                                </div>
                                <h3 className="text-3xl font-display font-bold text-white mb-2">Incoming Call</h3>
                                <p className="text-2xl text-unity-saffron font-bold mb-1">{incomingCall.from}</p>
                                <p className="text-gray-300 mb-4">📍 {incomingCall.fromRegion}</p>
                                <div className="inline-block bg-white/10 px-6 py-2 rounded-full">
                                    <p className="text-white font-semibold">
                                        Purpose: {callPurposes.find(p => p.id === incomingCall.purpose)?.label || 'Other'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    onClick={declineCall}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white border-red-800"
                                >
                                    Decline
                                </Button>
                                <Button
                                    variant="accent"
                                    onClick={acceptCall}
                                    className="flex-1"
                                >
                                    Accept
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageBackground>
    );
};

export default DrishtiMilan;
