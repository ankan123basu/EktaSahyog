import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer } = LayersControl;

// --- 1. Custom Icon Logic ---
// We use L.divIcon to create a custom marker with the entity's image
const createCustomIcon = (imageUrl, borderColor) => {
    return L.divIcon({
        className: 'custom-map-marker',
        html: `
        <div style="
            width: 48px; 
            height: 48px; 
            border-radius: 50%; 
            border: 3px solid ${borderColor}; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            background: white;
            position: relative;
        ">
            <img src="${imageUrl || 'https://via.placeholder.com/48'}" 
                 style="width: 100%; height: 100%; object-fit: cover;" 
                 onerror="this.src='https://via.placeholder.com/48?text=N/A'"
            />
        </div>
        `,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24]
    });
};

// --- 2. Expanded Coordinate Database ---
// To map "String" locations to [Lat, Long]
const REGION_COORDINATES = {
    // States & UTs
    "Andhra Pradesh": [15.9129, 79.7400],
    "Arunachal Pradesh": [28.2180, 94.7278],
    "Assam": [26.2006, 92.9376],
    "Bihar": [25.0961, 85.3131],
    "Chhattisgarh": [21.2787, 81.8661],
    "Goa": [15.2993, 74.1240],
    "Gujarat": [22.2587, 71.1924],
    "Haryana": [29.0588, 76.0856],
    "Himachal Pradesh": [31.1048, 77.1734],
    "Jharkhand": [23.6102, 85.2799],
    "Karnataka": [15.3173, 75.7139],
    "Kerala": [10.8505, 76.2711],
    "Madhya Pradesh": [22.9734, 78.6569],
    "Maharashtra": [19.7515, 75.7139],
    "Manipur": [24.6637, 93.9063],
    "Meghalaya": [25.4670, 91.3662],
    "Mizoram": [23.1645, 92.9376],
    "Nagaland": [26.1584, 94.5624],
    "Odisha": [20.9517, 85.0985],
    "Punjab": [31.1471, 75.3412],
    "Rajasthan": [27.0238, 74.2179],
    "Sikkim": [27.5330, 88.5122],
    "Tamil Nadu": [11.1271, 78.6569],
    "Telangana": [18.1124, 79.0193],
    "Tripura": [23.9408, 91.9882],
    "Uttar Pradesh": [26.8467, 80.9462],
    "Uttarakhand": [30.0668, 79.0193],
    "West Bengal": [22.9868, 87.8550],
    "Delhi": [28.7041, 77.1025],
    "Jammu": [32.7266, 74.8570],
    "Kashmir": [33.7782, 76.5762],
    "Ladakh": [34.1526, 77.5770],

    // Major Cities
    "Mumbai": [19.0760, 72.8777],
    "Pune": [18.5204, 73.8567],
    "Nagpur": [21.1458, 79.0882],
    "Bangalore": [12.9716, 77.5946],
    "Bengaluru": [12.9716, 77.5946],
    "Chennai": [13.0827, 80.2707],
    "Hyderabad": [17.3850, 78.4867],
    "Kolkata": [22.5726, 88.3639],
    "Ahmedabad": [23.0225, 72.5714],
    "Surat": [21.1702, 72.8311],
    "Jaipur": [26.9124, 75.7873],
    "Lucknow": [26.8467, 80.9462],
    "Kanpur": [26.4499, 80.3319],
    "Patna": [25.5941, 85.1376],
    "Indore": [22.7196, 75.8577],
    "Bhopal": [23.2599, 77.4126],
    "Ludhiana": [30.9010, 75.8573],
    "Agra": [27.1767, 78.0081],
    "Varanasi": [25.3176, 82.9739],
    "Visakhapatnam": [17.6868, 83.2185],
    "Guwahati": [26.1445, 91.7362],
    "Thiruvananthapuram": [8.5241, 76.9366],

    // Defaults
    "Pan-India": [20.5937, 78.9629],
    "All India": [20.5937, 78.9629]
};

// Component to handle View Movement based on Region Prop
const MapController = ({ region }) => {
    const map = useMap();
    useEffect(() => {
        const coords = REGION_COORDINATES[region];
        if (coords) {
            map.flyTo(coords, region === 'All India' ? 5 : 7, {
                duration: 1.5
            });
        }
    }, [region, map]);
    return null;
};

const MapVisualizer = ({ data, filters, region }) => {
    const center = [22.5937, 78.9629]; // Default Center
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        if (!data) return;

        let newMarkers = [];

        // 1. Process Projects
        if (filters.projects && data.projects) {
            data.projects.forEach(p => {
                let coords = getCoordinates(p.location);
                newMarkers.push({
                    id: `proj-${p._id}`,
                    title: p.title,
                    type: 'Project',
                    pos: coords,
                    image: p.image || "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=100", // Fallback
                    details: p.location,
                    color: '#f43f5e' // Coral
                });
            });
        }

        // 2. Process Artisans (Products)
        if (filters.artisans && data.artisans) {
            data.artisans.forEach(p => {
                let coords = getCoordinates(p.region);
                // Jitter slightly to avoid stacking if multiple from same region
                coords = [coords[0] + (Math.random() - 0.5) * 0.05, coords[1] + (Math.random() - 0.5) * 0.05];

                newMarkers.push({
                    id: `prod-${p._id}`,
                    title: p.title,
                    type: 'Artisan',
                    pos: coords,
                    image: p.image,
                    details: `By ${p.artisan} (${p.region})`,
                    color: '#f59e0b' // Saffron
                });
            });
        }

        // 3. Process Hotspots
        if (filters.hotspots && data.hotspots) {
            data.hotspots.forEach(h => {
                let coords = getCoordinates(h.location);
                newMarkers.push({
                    id: `hot-${h._id}`,
                    title: h.name,
                    type: 'Hotspot',
                    pos: coords,
                    image: h.image,
                    details: h.location,
                    color: '#4338ca' // Indigo
                });
            });
        }

        // 4. Process Culture
        if (filters.culture && data.culture) {
            data.culture.forEach(c => {
                let coords = getCoordinates(c.region);
                // Jitter slightly
                coords = [coords[0] + (Math.random() - 0.5) * 0.05, coords[1] + (Math.random() - 0.5) * 0.05];

                newMarkers.push({
                    id: `cult-${c._id}`,
                    title: c.title,
                    type: 'Culture',
                    pos: coords,
                    image: c.image,
                    details: c.category,
                    color: '#a855f7' // Purple
                });
            });
        }

        setMarkers(newMarkers);

    }, [data, filters]);

    // Helper: fuzzy match or default
    const getCoordinates = (locString) => {
        if (!locString) return REGION_COORDINATES["All India"];

        // Exact match
        if (REGION_COORDINATES[locString]) return REGION_COORDINATES[locString];

        // Partial match
        const keys = Object.keys(REGION_COORDINATES);
        const match = keys.find(k => locString.toLowerCase().includes(k.toLowerCase()));
        if (match) return REGION_COORDINATES[match];

        // Default with random placement near center
        return [20.5937 + (Math.random() - 0.5) * 5, 78.9629 + (Math.random() - 0.5) * 5];
    };

    return (
        <div className="h-full w-full bg-black/50">
            <MapContainer
                center={center}
                zoom={5}
                scrollWheelZoom={true}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                {/* 1. Map Layers Control (Topographical, Dark, Light, etc) */}
                <LayersControl position="topright">
                    <BaseLayer checked name="Dark Matter">
                        <TileLayer
                            attribution='&copy; CartoDB'
                            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name="Street Map">
                        <TileLayer
                            attribution='&copy; OpenStreetMap'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name="Satellite">
                        <TileLayer
                            attribution='&copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </BaseLayer>
                    <BaseLayer name="Terrain">
                        <TileLayer
                            attribution='&copy; OpenTopoMap'
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name="Voyager (Clean)">
                        <TileLayer
                            attribution='&copy; CARTO'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                    </BaseLayer>
                    <BaseLayer name="Positron (Minimal)">
                        <TileLayer
                            attribution='&copy; CartoDB'
                            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                        />
                    </BaseLayer>
                </LayersControl>

                <MapController region={region} />

                {/* 2. Render Custom Markers */}
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        position={marker.pos}
                        icon={createCustomIcon(marker.image, marker.color)}
                    >
                        <Popup className="retro-popup">
                            <div className="p-2 min-w-[200px]">
                                <div className="rounded-lg overflow-hidden h-32 w-full mb-3 border border-gray-200">
                                    <img
                                        src={marker.image}
                                        alt={marker.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = 'https://via.placeholder.com/200?text=No+Image'}
                                    />
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: marker.color }}></span>
                                    <h3 className="font-bold text-base text-gray-800 leading-tight">{marker.title}</h3>
                                </div>
                                <p className="text-xs text-gray-500 capitalize">{marker.type} • {marker.details}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapVisualizer;
