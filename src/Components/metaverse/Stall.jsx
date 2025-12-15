import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html, Float, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import Rangoli from './Rangoli';

// --- TUBE LIGHT (Fluorescent Bulb) ---
export function TubeLight({ position }) {
    return (
        <group position={position}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.05, 0.05, 2.8]} />
                <meshStandardMaterial color="#E0FFFF" emissive="#E0FFFF" emissiveIntensity={8} toneMapped={false} />
            </mesh>
            <pointLight intensity={6} distance={12} color="#E0FFFF" decay={1.5} />
        </group>
    );
}

// --- NEW: TUNI LIGHTS (Festive String Lights) ---
function TuniLights() {
    // Generate positions for string lights hanging from roof edge
    const lights = useMemo(() => {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"];
        const positions = [];
        // Front edge curve
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const x = -1.5 + (t * 3.0);
            const y = 3.2 - Math.sin(t * Math.PI) * 0.3; // Droop in middle
            const z = 1.3;
            positions.push({ pos: [x, y, z], color: colors[i % colors.length] });
        }
        return positions;
    }, []);

    return (
        <group>
            {lights.map((l, i) => (
                <mesh key={i} position={l.pos}>
                    <sphereGeometry args={[0.08, 8, 8]} />
                    <meshStandardMaterial color={l.color} emissive={l.color} emissiveIntensity={5} toneMapped={false} />
                    <pointLight distance={3} intensity={2} color={l.color} decay={2} />
                </mesh>
            ))}
        </group>
    );
}

const Stall = ({ position, product, onClick, hideOverlay }) => {
    const [hovered, setHovered] = useState(false);
    const groupRef = useRef();
    const shopkeeperRef = useRef();
    const headRef = useRef();

    const colors = useMemo(() => {
        // Use a better hash for valid IDs, or falling back to random
        let seed = 0;
        if (product._id) {
            const str = product._id.toString();
            for (let i = 0; i < str.length; i++) {
                seed += str.charCodeAt(i);
            }
        } else {
            seed = Math.floor(Math.random() * 1000);
        }

        const turbans = ["#FF6600", "#FFD700", "#FF3366", "#00CC99", "#3366FF"];
        const kurtas = ["#FFF8E1", "#E0F7FA", "#F3E5F5", "#E8F5E9"];
        const greetings = ["Namaste ji!", "Welcome!", "Ram Ram!", "Sat Sri Akal!", "Vanakkam!", "Khamma Ghani!"];

        return {
            turban: turbans[seed % turbans.length],
            kurta: kurtas[seed % kurtas.length],
            greeting: greetings[seed % greetings.length]
        };
    }, [product._id]);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (shopkeeperRef.current) {
            shopkeeperRef.current.position.y = 1.5 + Math.sin(t * 2) * 0.02;
        }
        if (headRef.current) {
            headRef.current.lookAt(state.camera.position);
        }
    });

    return (
        <group
            ref={groupRef}
            position={position}
            onClick={(e) => { e.stopPropagation(); onClick(product); }}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* --- RANGOLI (Culture Detail) --- */}
            <Rangoli position={[0, 0, 0]} />

            {/* --- SHOPKEEPER --- */}
            <group ref={shopkeeperRef} position={[1.8, 1.5, 0]}>
                <mesh position={[0, -0.4, 0]}>
                    <cylinderGeometry args={[0.35, 0.4, 1.6]} />
                    <meshStandardMaterial color={colors.kurta} />
                </mesh>
                <group ref={headRef} position={[0, 0.6, 0]}>
                    <mesh>
                        <sphereGeometry args={[0.3, 16, 16]} />
                        <meshStandardMaterial color="#8D5524" />
                    </mesh>
                    <mesh position={[0, 0.25, 0]}>
                        <torusGeometry args={[0.25, 0.15, 8, 16]} rotation={[Math.PI / 2, 0, 0]} />
                        <meshStandardMaterial color={colors.turban} />
                    </mesh>
                </group>
                <mesh position={[-0.3, 0, 0]} rotation={[0, 0, -0.5]}>
                    <capsuleGeometry args={[0.1, 0.8]} />
                    <meshStandardMaterial color={colors.kurta} />
                </mesh>
            </group>

            {/* --- HUT STRUCTURE --- */}
            <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[2.5, 2.8, 0.3, 8]} />
                <meshStandardMaterial color="#5C4033" roughness={1} />
            </mesh>

            {[[-1.2, 0.8], [1.2, 0.8], [-1.2, -0.8], [1.2, -0.8]].map((pos, i) => (
                <mesh key={i} position={[pos[0], 2, pos[1]]}>
                    <cylinderGeometry args={[0.08, 0.08, 4]} />
                    <meshStandardMaterial color="#3E2723" />
                </mesh>
            ))}

            <mesh position={[0, 1.2, 0.5]}>
                <boxGeometry args={[2.8, 0.1, 1.2]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            <mesh position={[0, 1.26, 0.5]}>
                <boxGeometry args={[2.6, 0.0, 1.0]} />
                <meshStandardMaterial color="#D2691E" />
            </mesh>

            <mesh position={[0, 4.2, 0]}>
                <coneGeometry args={[3.5, 2.0, 6]} />
                <meshStandardMaterial color="#DAA520" />
            </mesh>

            {/* LIGHTS: Tube & Tuni */}
            <TubeLight position={[0, 3.2, 1.2]} />
            <TuniLights />

            {/* --- FLOATING PRODUCT IMAGE --- */}
            <Float speed={2} rotationIntensity={0.1} floatIntensity={0.5}>
                <group position={[0, 2.5, 0.5]}>
                    <mesh position={[0, 0, -0.05]}>
                        <boxGeometry args={[1.7, 1.7, 0.1]} />
                        <meshStandardMaterial color="#4A3728" />
                    </mesh>

                    {!hideOverlay && (
                        <Html
                            transform
                            position={[0, 0, 0.06]}
                            scale={0.15}
                            style={{ pointerEvents: 'none' }}
                        >
                            <div className="w-64 h-64 bg-[#FFF8DC] border-4 border-[#8B4513] rounded-sm flex items-center justify-center shadow-lg">
                                <img
                                    src={product.image || "https://images.unsplash.com/photo-1605218427368-35b868d40785"}
                                    alt={product.name}
                                    className="w-full h-full object-cover sepia-[0.3]"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://placehold.co/400x400/8B4513/FFF8DC?text=Item";
                                    }}
                                />
                            </div>
                        </Html>
                    )}
                </group>
            </Float>

            {/* --- BILLBOARD SIGNAGE --- */}
            <Billboard position={[0, 3.8, 0]}>
                <Text
                    fontSize={0.5}
                    color="#FFD700"
                    anchorY="bottom"
                    outlineWidth={0.02}
                    outlineColor="#3E2723"
                    fontWeight="bold"
                >
                    {product.name}
                </Text>
                <Text
                    position={[0, -0.4, 0]}
                    fontSize={0.3}
                    color="white"
                    anchorY="top"
                    outlineWidth={0.02}
                    outlineColor="#3E2723"
                >
                    ₹{product.price}
                </Text>
            </Billboard>

            {/* Tooltip */}
            {hovered && !hideOverlay && (
                <Html position={[0, 5, 0]} center distanceFactor={12} style={{ pointerEvents: 'none' }}>
                    <div className="bg-[#FFF] text-[#3E2723] px-5 py-3 rounded-lg border-2 border-gold shadow-[0_0_15px_gold] text-center font-serif whitespace-nowrap">
                        <p className="text-lg font-bold text-orange-600 mb-1">{colors.greeting}</p>
                        <p className="font-semibold text-sm">✨ Interact and Buy</p>
                    </div>
                </Html>
            )}
        </group>
    );
};

export default Stall;
