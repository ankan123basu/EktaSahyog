import React, { useState, useEffect } from 'react';
import MapVisualizer from '../Components/features/MapVisualizer';
import { Layers, Map as MapIcon, Users, Activity, ShoppingBag, Palette, MapPin, Globe } from 'lucide-react';
import bg1 from '../Images/wmremove-transformed.png';

const MapPage = () => {
    // 1. State for Data
    const [stats, setStats] = useState({ users: 0, projects: 0, artisans: 0, hotspots: 0, culture: 0 });
    const [mapData, setMapData] = useState({ projects: [], artisans: [], hotspots: [], culture: [] });
    const [filteredData, setFilteredData] = useState({ projects: [], artisans: [], hotspots: [], culture: [] });
    const [loading, setLoading] = useState(true);

    // 2. State for Filters (Layers)
    const [filters, setFilters] = useState({
        projects: false,
        artisans: false,
        hotspots: false,
        culture: false
    });

    const [activeRegion, setActiveRegion] = useState("All India");

    // Region Mapping Helper
    const STATE_GROUPS = {
        "North India": ["Delhi", "Haryana", "Himachal Pradesh", "Jammu", "Kashmir", "Ladakh", "Punjab", "Rajasthan", "Uttar Pradesh", "Uttarakhand", "Chandigarh"],
        "South India": ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Puducherry", "Lakshadweep"],
        "East India": ["Bihar", "Jharkhand", "Odisha", "West Bengal", "Andaman and Nicobar Islands"],
        "West India": ["Goa", "Gujarat", "Maharashtra", "Dadra and Nagar Haveli and Daman and Diu"],
        "Central India": ["Chhattisgarh", "Madhya Pradesh"],
        "North East India": ["Arunachal Pradesh", "Assam", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Sikkim", "Tripura"]
    };

    const ALL_STATES = Object.values(STATE_GROUPS).flat().sort();

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [usersRes, projectsRes, productsRes, hotspotsRes, cultureRes] = await Promise.all([
                    fetch('http://localhost:5001/auth/users/count'),
                    fetch('http://localhost:5001/projects'),
                    fetch('http://localhost:5001/marketplace'),
                    fetch('http://localhost:5001/hotspots'),
                    fetch('http://localhost:5001/culture')
                ]);

                const usersData = await usersRes.json();
                const projectsData = await projectsRes.json();
                const productsData = await productsRes.json();
                const hotspotsData = await hotspotsRes.json();
                const cultureData = await cultureRes.json();

                setStats({
                    users: usersData.count || 0,
                    projects: projectsData.length || 0,
                    artisans: productsData.length || 0,
                    hotspots: hotspotsData.length || 0,
                    culture: cultureData.length || 0
                });

                const allData = {
                    projects: projectsData,
                    artisans: productsData,
                    hotspots: hotspotsData,
                    culture: cultureData
                };

                setMapData(allData);
                setFilteredData(allData); // Initially show all

            } catch (err) {
                console.error("Error fetching map data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // Effect to filtering data when ActiveRegion changes
    useEffect(() => {
        if (activeRegion === "All India") {
            setFilteredData(mapData);
            return;
        }

        const filterItem = (item) => {
            // Check if item's location/region matches the selected region
            // Logic: 
            // 1. If activeRegion is a "Zone" (e.g. North India), check if item state is in that zone.
            // 2. If activeRegion is a "State", check if item location contains that state name.

            const location = (item.location || item.region || "").toLowerCase();
            const selected = activeRegion.toLowerCase();

            // Case A: Selected a Zone (North/South etc)
            if (STATE_GROUPS[activeRegion]) {
                return STATE_GROUPS[activeRegion].some(state => location.includes(state.toLowerCase()));
            }

            // Case B: Selected a specific State
            // Also check for major cities if needed, but here simple string include is a good start
            return location.includes(selected);
        };

        setFilteredData({
            projects: mapData.projects.filter(filterItem),
            artisans: mapData.artisans.filter(filterItem),
            hotspots: mapData.hotspots.filter(filterItem),
            culture: mapData.culture.filter(filterItem),
        });

    }, [activeRegion, mapData]);


    const toggleFilter = (key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }));

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-8 flex flex-col bg-unity-dark relative overflow-hidden">
            {/* Background Consistency */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/60 to-unity-dark" />
            </div>

            {/* Header Section */}
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-5xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-2">
                        IMPACT MAP
                    </h1>
                    <p className="text-xl text-gray-300">
                        Visualizing unity across the nation. Real-time data of our social impact.
                    </p>
                </div>

                {/* Live Stats */}
                <div className="flex flex-wrap gap-4">
                    <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 backdrop-blur-md">
                        <Users className="text-unity-emerald" size={20} />
                        <div>
                            <span className="block text-white font-bold text-lg leading-none">{stats.users.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Members</span>
                        </div>
                    </div>
                    <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 backdrop-blur-md">
                        <Activity className="text-unity-coral" size={20} />
                        <div>
                            <span className="block text-white font-bold text-lg leading-none">{stats.projects}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Projects</span>
                        </div>
                    </div>
                    <div className="bg-black/40 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3 backdrop-blur-md">
                        <MapPin className="text-unity-indigo" size={20} />
                        <div>
                            <span className="block text-white font-bold text-lg leading-none">{stats.hotspots}</span>
                            <span className="text-xs text-gray-400 uppercase tracking-wider">Hotspots</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 relative z-10">
                {/* Controls Sidebar */}
                <div className="w-full lg:w-72 space-y-6">
                    {/* Filter Card */}
                    <div className="retro-card p-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
                        <h3 className="font-display text-unity-saffron mb-4 flex items-center gap-2 text-lg">
                            <Layers size={18} /> DATA LAYERS
                        </h3>
                        <div className="space-y-3">
                            <FilterToggle
                                label="Projects"
                                checked={filters.projects}
                                icon={<Activity size={18} className={filters.projects ? "text-white" : "text-unity-coral"} />}
                                onChange={() => toggleFilter('projects')}
                            />
                            <FilterToggle
                                label="Artisans"
                                checked={filters.artisans}
                                icon={<ShoppingBag size={18} className={filters.artisans ? "text-white" : "text-unity-saffron"} />}
                                onChange={() => toggleFilter('artisans')}
                            />
                            <FilterToggle
                                label="Hotspots"
                                checked={filters.hotspots}
                                icon={<MapPin size={18} className={filters.hotspots ? "text-white" : "text-unity-indigo"} />}
                                onChange={() => toggleFilter('hotspots')}
                            />
                            <FilterToggle
                                label="Culture"
                                checked={filters.culture}
                                icon={<Palette size={18} className={filters.culture ? "text-white" : "text-purple-500"} />}
                                onChange={() => toggleFilter('culture')}
                            />
                        </div>
                    </div>

                    {/* Region Filter */}
                    <div className="retro-card p-5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl">
                        <h3 className="font-display text-unity-emerald mb-4 flex items-center gap-2 text-lg">
                            <MapIcon size={18} /> REGIONS
                        </h3>
                        <select
                            value={activeRegion}
                            onChange={(e) => setActiveRegion(e.target.value)}
                            className="w-full bg-black border border-white/10 p-3 text-white rounded-lg focus:outline-none focus:border-unity-emerald transition-colors"
                        >
                            <option className="bg-black text-white">All India</option>
                            <optgroup label="Zones" className="bg-black text-white">
                                {Object.keys(STATE_GROUPS).map(zone => (
                                    <option key={zone} value={zone} className="bg-black text-white">{zone}</option>
                                ))}
                            </optgroup>
                            <optgroup label="States" className="bg-black text-white">
                                {ALL_STATES.map(state => (
                                    <option key={state} value={state} className="bg-black text-white">{state}</option>
                                ))}
                            </optgroup>
                        </select>
                        <p className="text-xs text-gray-500 mt-2">
                            Filtering data to show only {activeRegion}.
                        </p>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 min-h-[600px] rounded-xl overflow-hidden border border-white/10 shadow-2xl relative">
                    {!loading && (
                        <MapVisualizer
                            data={filteredData}  // NOW PASSING FILTERED DATA
                            filters={filters}
                            region={activeRegion}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

// Updated Toggle with Icons
const FilterToggle = ({ label, checked, onChange, icon }) => (
    <label className="flex items-center justify-between cursor-pointer group p-3 rounded-lg transition-colors border border-white/5 min-h-[50px] relative overflow-hidden">
        {/* Background color based on Checked State (Subtle) */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${checked ? 'bg-green-500/10' : 'bg-red-500/5'}`}></div>

        <div className="flex items-center gap-3 relative z-10">
            {/* ICON CONTAINER: Green when checked, Red-ish outline when unchecked */}
            <div className={`p-1.5 rounded-full transition-colors ${checked ? 'bg-green-600' : 'bg-red-500/20 text-red-400'}`}>
                {icon}
            </div>
            <span className={`transition-colors font-medium ${checked ? 'text-white' : 'text-gray-400'}`}>{label}</span>
        </div>

        {/* The Toggle Switch Itself */}
        <div className="relative z-10 ml-4">
            <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
            <div className={`w-12 h-6 rounded-full transition-colors duration-300 flex items-center p-1 ${checked ? 'bg-green-600' : 'bg-red-500/80'}`}>
                <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    </label>
);

export default MapPage;
