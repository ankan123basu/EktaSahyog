import React, { useState, useEffect } from 'react';
import ChatSidebar from '../Components/features/ChatSidebar';
import ChatInterface from '../Components/features/ChatInterface';
import PageBackground from '../Components/layout/PageBackground';
import io from 'socket.io-client';

const socket = io.connect("http://localhost:5001");

const Chat = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [activeChannel, setActiveChannel] = useState(
        user?.location ? user.location.toLowerCase().replace(/\s+/g, '') : 'global'
    );
    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        socket.emit('request_user_count'); // Request initial count

        socket.on('update_online_users', (users) => {
            // Remove duplicates if any (though Map handles IDs, same user might login twice)
            const uniqueUsers = [...new Set(users)];
            setOnlineUsers(uniqueUsers);
        });

        return () => {
            socket.off('update_online_users');
        };
    }, []);

    return (
        <PageBackground>
            <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-8 h-screen flex flex-col">
                <div className="flex-1 retro-card overflow-hidden flex flex-col md:flex-row bg-unity-dark/90">
                    <ChatSidebar
                        activeChannel={activeChannel}
                        onSelectChannel={setActiveChannel}
                        onlineUsers={onlineUsers}
                    />
                    <div className="flex-1 h-full border-l border-white/10">
                        <ChatInterface channelId={activeChannel} socket={socket} />
                    </div>
                </div>
            </div>
        </PageBackground>
    );
};

export default Chat;
