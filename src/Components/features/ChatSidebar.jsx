import React from 'react';
import { Hash, Globe, MapPin, Users } from 'lucide-react';

const CHANNELS = [
    { id: 'global', name: 'Global Unity', type: 'global' },
    { id: 'punjab', name: 'Punjab Connect', type: 'regional' },
    { id: 'kerala', name: 'Kerala Relief', type: 'regional' },
    { id: 'assam', name: 'Assam Artisans', type: 'regional' },
    { id: 'maharashtra', name: 'Maharashtra Hub', type: 'regional' },
    { id: 'tamilnadu', name: 'Tamil Nadu Culture', type: 'regional' },
    { id: 'westbengal', name: 'Bengal Heritage', type: 'regional' },
    { id: 'gujarat', name: 'Gujarat Trade', type: 'regional' },
    { id: 'karnataka', name: 'Karnataka Tech', type: 'regional' },
    { id: 'tech', name: 'Tech Support', type: 'topic' },
];

const ChatSidebar = ({ activeChannel, onSelectChannel, onlineUsers = [] }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userLocation = user?.location?.toLowerCase().replace(/\s+/g, '') || '';
    const isAdmin = user?.role === 'admin';

    const visibleChannels = CHANNELS.filter(channel => {
        if (isAdmin) return true; // Admin sees all
        if (channel.type === 'global' || channel.type === 'topic') return true; // Everyone sees global/topic
        // Regional check
        return channel.id === userLocation || channel.name.toLowerCase().replace(/\s+/g, '').includes(userLocation);
    });

    return (
        <div className="w-full md:w-64 bg-black/20 border-r border-white/10 flex flex-col h-full">
            <div className="p-4 border-b border-white/10">
                <h3 className="font-display text-sm text-white flex items-center gap-2">
                    <Globe size={16} className="text-unity-emerald" /> CHANNELS
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {visibleChannels.map(channel => (
                    <button
                        key={channel.id}
                        onClick={() => onSelectChannel(channel.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeChannel === channel.id
                            ? 'bg-unity-indigo/20 text-unity-saffron border border-unity-indigo/50'
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                    >
                        {channel.type === 'global' ? <Globe size={16} /> :
                            channel.type === 'regional' ? <MapPin size={16} /> : <Hash size={16} />}
                        <span className="text-sm font-medium truncate">{channel.name}</span>
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-white/10 bg-black/40 overflow-y-auto max-h-[35vh] custom-scrollbar">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 uppercase tracking-wider font-bold">
                    <Users size={12} />
                    <span>Online — {onlineUsers.length}</span>
                </div>
                <div className="space-y-2">
                    {onlineUsers.map((u, i) => (
                        <div key={i} className="flex items-center gap-2 group">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-gray-300 text-sm group-hover:text-white transition-colors truncate">
                                {u} {u === user?.name ? '(You)' : ''}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChatSidebar;
