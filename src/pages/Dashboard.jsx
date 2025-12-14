import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis, Radar, RadialBarChart, RadialBar, ScatterChart,
    Scatter, ZAxis, ComposedChart, Treemap, FunnelChart, Funnel, LabelList, Sector
} from 'recharts';

const RADIAN = Math.PI / 180;
import {
    Users, ShoppingBag, Map as MapIcon, Shield, Activity, TrendingUp, Globe,
    Server, Filter, Landmark, Flame, Zap, Heart, Star, Target, Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import bg1 from '../Images/wmremove-transformed.png';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#a855f7', '#d946ef'];
const GRADIENT_COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#feca57', '#48dbfb', '#ff6b6b', '#4ecdc4'];

// Mock data generator for when real data is empty
const getMockData = (type) => {
    const mocks = {
        hotspots: [
            { name: 'Taj Mahal', likes: 250, visits: 300 },
            { name: 'Golden Temple', likes: 220, visits: 280 },
            { name: 'Jaipur Palace', likes: 180, visits: 240 },
            { name: 'Kerala Backwaters', likes: 150, visits: 200 },
            { name: 'Goa Beaches', likes: 120, visits: 180 }
        ],
        culture: [
            { category: 'Festivals', count: 45, engagement: 89 },
            { category: 'Food', count: 38, engagement: 92 },
            { category: 'Art', count: 32, engagement: 78 },
            { category: 'Dance', count: 28, engagement: 85 },
            { category: 'Music', count: 25, engagement: 88 }
        ],
        userGrowth: [
            { month: 'Jan', users: 12, active: 8 },
            { month: 'Feb', users: 25, active: 18 },
            { month: 'Mar', users: 40, active: 32 },
            { month: 'Apr', users: 68, active: 52 },
            { month: 'May', users: 90, active: 72 },
            { month: 'Jun', users: 120, active: 98 }
        ],
        sentiment: [
            { subject: 'Trust', value: 85 },
            { subject: 'Engagement', value: 78 },
            { subject: 'Support', value: 92 },
            { subject: 'Unity', value: 88 },
            { subject: 'Safety', value: 82 }
        ],
        languages: [
            { name: 'Hindi', value: 35, users: 42 },
            { name: 'English', value: 25, users: 30 },
            { name: 'Bengali', value: 12, users: 14 },
            { name: 'Tamil', value: 10, users: 12 },
            { name: 'Telugu', value: 8, users: 96 },
            { name: 'Marathi', value: 10, users: 120 }
        ],
        // Updated to realistic 200-300 range as requested
        revenue: [
            { month: 'Jan', revenue: 210, products: 4 },
            { month: 'Feb', revenue: 245, products: 6 },
            { month: 'Mar', revenue: 280, products: 8 },
            { month: 'Apr', revenue: 320, products: 12 },
            { month: 'May', revenue: 290, products: 10 },
            { month: 'Jun', revenue: 350, products: 15 }
        ],
        regions: [
            { name: 'North', size: 35, value: 35 },
            { name: 'South', size: 28, value: 28 },
            { name: 'East', size: 22, value: 22 },
            { name: 'West', size: 29, value: 29 },
            { name: 'Central', size: 16, value: 16 }
        ],
        funnel: [
            { name: 'Visitors', value: 1000, fill: '#667eea' },
            { name: 'Sign Ups', value: 650, fill: '#8b5cf6' },
            { name: 'Active Users', value: 420, fill: '#ec4899' },
            { name: 'Contributors', value: 180, fill: '#f43f5e' },
            { name: 'Champions', value: 52, fill: '#f59e0b' }
        ],
        market: [
            { _id: 'Handicrafts', value: 350, count: 45 },
            { _id: 'Textiles', value: 280, count: 67 },
            { _id: 'Art', value: 420, count: 52 },
            { _id: 'Pottery', value: 190, count: 35 },
            { _id: 'Jewelry', value: 310, count: 28 }
        ]
    };
    return mocks[type] || [];
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/95 border border-white/20 p-4 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.9)] backdrop-blur-xl">
                <p className="text-unity-saffron font-bold mb-2 text-lg">{label || payload[0].name}</p>
                {payload.map((pld, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                        <span className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]" style={{ backgroundColor: pld.color || pld.fill }}></span>
                        <span className="text-gray-300 capitalize font-medium">{pld.name || pld.dataKey}:</span>
                        <span className="font-bold text-white text-base">
                            {typeof pld.value === 'number' ? pld.value.toLocaleString() : pld.value}
                        </span>
                    </div>
                ))}
            </div>
        );
    }
    return null;
};

const renderActiveShape = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#fff" className="text-xl font-bold font-display filter drop-shadow-lg">
                {payload.name || payload.title}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                className="filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#fff" fontSize={12} fontWeight="bold">{`Likes: ${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999" fontSize={10}>
                {`(${(percent * 100).toFixed(0)}%)`}
            </text>
        </g>
    );
};

const Dashboard = () => {
    const [user, setUser] = useState({});
    const [summary, setSummary] = useState(null);
    const [charts, setCharts] = useState(null);
    const [regionFilter, setRegionFilter] = useState('all');
    const [activeIndex, setActiveIndex] = useState(0);

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== "undefined") setUser(JSON.parse(storedUser));
        } catch (err) {
            console.error("Error parsing user data:", err);
        }
    }, []);

    const isAdmin = user?.email === 'admin@ektasahyog.com';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const query = regionFilter !== 'all' ? `?region=${regionFilter}` : '';
                const [summaryRes, chartRes] = await Promise.all([
                    fetch(`http://localhost:5001/dashboard/summary${query}`),
                    fetch(`http://localhost:5001/dashboard/charts${query}`)
                ]);

                const summaryData = await summaryRes.json();
                const chartData = await chartRes.json();

                setSummary(summaryData);
                setCharts(chartData);
            } catch (err) {
                console.error("Failed to fetch dashboard data", err);
            }
        };

        if (isAdmin) fetchData();
    }, [isAdmin, regionFilter]);

    if (!user.name) return <div className="text-white text-center pt-20">Please login.</div>;
    if (!isAdmin) return <div className="text-white text-center pt-20">Access Denied</div>;

    // Data with fallbacks
    const hotspotData = charts?.topHotspots?.length ? charts.topHotspots : getMockData('hotspots');
    const cultureData = charts?.cultureCategories?.length ? charts.cultureCategories.map(c => ({ category: c._id, count: c.count, engagement: Math.floor(Math.random() * 30 + 70) })) : getMockData('culture');
    const userGrowthData = getMockData('userGrowth');
    const sentimentData = getMockData('sentiment');
    const languageData = charts?.languages?.length ? charts.languages : getMockData('languages');
    const revenueData = getMockData('revenue');
    const regionData = charts?.userMap?.length ? charts.userMap.map(r => ({ name: r._id, size: r.count, value: r.count })) : getMockData('regions');
    const funnelData = getMockData('funnel');

    return (
        <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8 pb-12 bg-unity-dark relative overflow-hidden">
            {/* Background & Overlay */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            {/* Ambient Lighting for Brightness */}
            <div className="absolute top-40 right-0 w-96 h-96 bg-unity-coral/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-unity-indigo/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1800px] mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient tracking-tight drop-shadow-[0_0_30px_rgba(168,85,247,0.5)] font-display">
                            Analytics Command Center
                        </h1>
                        <p className="text-gray-300 mt-2 flex items-center gap-2 text-xl font-light">
                            <Activity size={24} className="text-unity-saffron animate-pulse" /> 14 Real-Time Intelligence Modules
                        </p>
                    </div>

                    <select
                        value={regionFilter}
                        onChange={(e) => setRegionFilter(e.target.value)}
                        className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-500/30 rounded-2xl px-6 py-3 text-white text-base font-bold focus:outline-none focus:border-purple-400 focus:shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all cursor-pointer backdrop-blur-xl min-w-[250px]"
                    >
                        <option value="all">🌏 All India</option>
                        <option value="North">🏔️ North</option>
                        <option value="South">🌴 South</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Maharashtra">Maharashtra</option>
                    </select>
                </div>

                {/* KPI Mega Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-10">
                    {[
                        { label: 'Hotspots', value: summary?.hotspotCount || 127, icon: <Flame />, color: 'text-orange-500', border: 'border-orange-500/30' },
                        { label: 'Culture', value: summary?.cultureCount || 89, icon: <Landmark />, color: 'text-pink-500', border: 'border-pink-500/30' },
                        { label: 'Users', value: summary?.userCount || 1247, icon: <Users />, color: 'text-blue-500', border: 'border-blue-500/30' },
                        { label: 'Projects', value: summary?.projectCount || 45, icon: <MapIcon />, color: 'text-green-500', border: 'border-green-500/30' },
                        { label: 'Products', value: summary?.productCount || 234, icon: <ShoppingBag />, color: 'text-purple-500', border: 'border-purple-500/30' },
                        { label: 'Revenue', value: '₹1,695', icon: <TrendingUp />, color: 'text-cyan-500', border: 'border-cyan-500/30' },
                        { label: 'Live', value: 'Active', icon: <Zap />, color: 'text-yellow-500', border: 'border-yellow-500/30' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5, backgroundColor: 'rgba(255,255,255,0.08)' }}
                            transition={{ delay: i * 0.05 }}
                            className={`bg-white/5 border ${stat.border} p-4 rounded-2xl backdrop-blur-sm cursor-pointer group hover:shadow-lg transition-all`}
                        >
                            <div className={`text-white/80 mb-2 transform group-hover:scale-110 transition-transform ${stat.color}`}>{stat.icon}</div>
                            <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mt-1">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* 14 Premium 3D Charts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 grid-flow-dense">

                    {/* 1. Hotspot Popularity - 3D Bar */}
                    <ChartCard title="Hotspot Dominance" icon={<Flame className="text-orange-500" />} gradient="from-orange-500/10 to-red-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hotspotData}>
                                <defs>
                                    <linearGradient id="hotspotGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#dc2626" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fontSize: 11 }} />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="likes" fill="url(#hotspotGrad)" radius={[12, 12, 0, 0]} className="drop-shadow-[0_8px_16px_rgba(245,158,11,0.4)]" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 2. Culture Engagement - Rose Chart (Variable Radius Pie) */}
                    <ChartCard title="Culture Pulse" icon={<Landmark className="text-pink-500" />} gradient="from-pink-500/10 to-purple-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={charts?.topCulture?.length ? charts.topCulture : getMockData('culture')}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={100}
                                    dataKey={charts?.topCulture?.length ? "likes" : "engagement"}
                                    nameKey={charts?.topCulture?.length ? "title" : "category"}
                                    onMouseEnter={onPieEnter}
                                    stroke="none"
                                >
                                    {(charts?.topCulture || getMockData('culture')).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            style={{
                                                filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length]})`
                                            }}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <Legend iconSize={8} layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 10 }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 3. User Growth - Area with Gradient */}
                    <ChartCard title="User Momentum" icon={<Users className="text-blue-500" />} gradient="from-blue-500/10 to-cyan-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={charts?.userGrowth?.length ? charts.userGrowth : getMockData('userGrowth')}>
                                <defs>
                                    <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey={charts?.userGrowth?.length ? "_id" : "month"} stroke="#9ca3af" tick={{ fontSize: 11 }} />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }} />
                                <Area type="monotone" dataKey={charts?.userGrowth?.length ? "users" : "users"} stroke="#3b82f6" strokeWidth={3} fill="url(#userGrad)" className="drop-shadow-[0_4px_12px_rgba(59,130,246,0.6)]" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 4. Sentiment Radar */}
                    <ChartCard title="Community Trust Index" icon={<Heart className="text-red-500" />} gradient="from-red-500/10 to-pink-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={sentimentData}>
                                <PolarGrid stroke="#ffffff15" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <PolarRadiusAxis domain={[0, 100]} tick={false} />
                                <Radar name="Trust" dataKey="value" stroke="#ef4444" fill="#ef4444" fillOpacity={0.7} className="drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]" />
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 5. Language Distribution - Donut */}
                    <ChartCard title="Language Diversity" icon={<Globe className="text-green-500" />} gradient="from-green-500/10 to-emerald-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={languageData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none">
                                    {languageData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]" />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 6. Revenue Trend - Bar & Line */}
                    <ChartCard title="Revenue Trajectory" icon={<TrendingUp className="text-cyan-500" />} gradient="from-cyan-500/10 to-blue-600/5" span="md:col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <ComposedChart data={getMockData('revenue')}>
                                <defs>
                                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="revenue" fill="url(#revGrad)" barSize={40} radius={[4, 4, 0, 0]} name="Revenue (₹)" />
                                <Line type="monotone" dataKey="products" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} name="Products" />
                                <Legend />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 7. Regional Activity - Treemap */}
                    <ChartCard title="Regional Distribution" icon={<MapIcon className="text-purple-500" />} gradient="from-purple-500/10 to-indigo-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <Treemap data={regionData} dataKey="size" aspectRatio={4 / 3} stroke="#fff" fill="#8884d8">
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                {regionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Treemap>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 8. Chat Activity - Line with Dots */}
                    <ChartCard title="Chat Pulse (7 Days)" icon={<Activity className="text-yellow-500" />} gradient="from-yellow-500/10 to-orange-600/5" span="md:col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={charts?.chatActivity?.length ? charts.chatActivity : [{ _id: 'Mon', messages: 45 }, { _id: 'Tue', messages: 67 }, { _id: 'Wed', messages: 89 }, { _id: 'Thu', messages: 72 }, { _id: 'Fri', messages: 110 }, { _id: 'Sat', messages: 95 }, { _id: 'Sun', messages: 82 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="_id" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)' }} />
                                <Line type="monotone" dataKey="messages" stroke="#eab308" strokeWidth={4} dot={{ r: 6, fill: '#eab308', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} className="drop-shadow-[0_0_12px_rgba(234,179,8,0.8)]" />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 9. Market Categories - Stacked Bar */}
                    <ChartCard title="Market Segments" icon={<ShoppingBag className="text-indigo-500" />} gradient="from-indigo-500/10 to-purple-600/5" span="md:col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={getMockData('market')}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="_id" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} name="Value (₹)">
                                    {getMockData('market').map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                                    ))}
                                </Bar>
                                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Items" />
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 10. Story Impact - Scatter */}
                    <ChartCard title="Story Resonance" icon={<Star className="text-yellow-400" />} gradient="from-yellow-500/10 to-amber-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis type="number" dataKey="views" name="Views" stroke="#9ca3af" />
                                <YAxis type="number" dataKey="likes" name="Likes" stroke="#9ca3af" />
                                <ZAxis type="number" dataKey="likes" range={[60, 400]} />
                                <Tooltip cursor={{ strokeDasharray: '3 3', stroke: 'rgba(255,255,255,0.2)' }} content={<CustomTooltip />} />
                                <Scatter name="Stories" data={charts?.storyEngagement?.length ? charts.storyEngagement : [{ title: 'Story1', views: 250, likes: 45 }, { title: 'Story2', views: 180, likes: 32 }, { title: 'Story3', views: 320, likes: 67 }]} fill="#fbbf24" className="drop-shadow-[0_4px_8px_rgba(251,191,36,0.6)]" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 11. Project Status - Bar Chart (Previously Pie/Radial) */}
                    <ChartCard title="Project Pipeline" icon={<Target className="text-green-600" />} gradient="from-green-500/10 to-teal-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts?.projectStatus?.length ? charts.projectStatus : [{ _id: 'Active', count: 28 }, { _id: 'Completed', count: 17 }]}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis dataKey="_id" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={50} name="Projects">
                                    {(charts?.projectStatus || [{ _id: 'Active' }, { _id: 'Completed' }]).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                                <Legend />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 12. Resource Arsenal - Horizontal Bar */}
                    <ChartCard title="Resource Arsenal" icon={<Server className="text-teal-500" />} gradient="from-teal-500/10 to-cyan-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart
                                layout="vertical"
                                data={charts?.resources?.length ? charts.resources : [{ _id: 'Documents', count: 45 }, { _id: 'Videos', count: 32 }, { _id: 'Links', count: 12 }]}
                                margin={{ left: 20 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis dataKey="_id" type="category" stroke="#9ca3af" width={80} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                <Bar dataKey="count" fill="#14b8a6" radius={[0, 4, 4, 0]}>
                                    {(charts?.resources || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 13. Engagement Funnel */}
                    <ChartCard title="User Journey Funnel" icon={<Layers className="text-purple-400" />} gradient="from-purple-500/10 to-pink-600/5">
                        <ResponsiveContainer width="100%" height={300}>
                            <FunnelChart>
                                <Tooltip content={<CustomTooltip />} />
                                <Funnel dataKey="value" data={funnelData}>
                                    <LabelList position="inside" fill="#fff" stroke="none" fontSize={12} />
                                </Funnel>
                            </FunnelChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    {/* 14. Hotspot Tags Distribution - Horizontal Bar */}
                    <ChartCard title="Tag Cloud Power" icon={<Flame className="text-red-500" />} gradient="from-red-500/10 to-orange-600/5" span="md:col-span-2">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={charts?.hotspotTags?.length ? charts.hotspotTags : [{ _id: 'Heritage', count: 45 }, { _id: 'Adventure', count: 38 }, { _id: 'Nature', count: 52 }, { _id: 'Spiritual', count: 41 }]} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                                <XAxis type="number" stroke="#9ca3af" />
                                <YAxis dataKey="_id" type="category" stroke="#9ca3af" width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                                    {(charts?.hotspotTags || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                </div>
            </div>
        </div>
    );
};

// Reusable Chart Card with 3D Effect
const ChartCard = ({ title, icon, children, gradient, span = '' }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, scale: 1.02 }}
        className={`bg-gradient-to-br ${gradient} backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden group ${span} transform-gpu`}
        style={{
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)',
            transform: 'perspective(1000px) rotateX(0deg)',
            transition: 'all 0.3s ease'
        }}
        onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        }}
        onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        }}
    >
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-white" style={{ fontSize: 80 }}>{icon}</div>
        <h3 className="text-xl font-bold font-display text-white mb-6 flex items-center gap-3 relative z-10 drop-shadow-lg">
            {icon} {title}
        </h3>
        <div className="relative z-10">{children}</div>
    </motion.div>
);

export default Dashboard;
