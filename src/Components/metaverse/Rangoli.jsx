import React, { useMemo } from 'react';

const Rangoli = ({ position, scale = 1, seed = 0 }) => {
    const colors = useMemo(() => {
        const palettes = [
            ['#FF4500', '#FFD700', '#8B0000'], // Red/Gold
            ['#E91E63', '#9C27B0', '#4A148C'], // Pink/Purple
            ['#00C853', '#64DD17', '#1B5E20'], // Green/Lime
            ['#00B0FF', '#0091EA', '#01579B'], // Blue/Cyan
            ['#FF6D00', '#FFAB40', '#E65100'], // Orange
        ];
        return palettes[seed % palettes.length];
    }, [seed]);

    return (
        <group position={[position[0], 0.02, position[2]]} rotation={[-Math.PI / 2, 0, 0]} scale={scale}>
            {/* Base Layer */}
            <mesh>
                <circleGeometry args={[2.5, 32]} />
                <meshStandardMaterial color={colors[2]} />
            </mesh>

            {/* Pattern Layer 1 (Ring) */}
            <mesh position={[0, 0, 0.01]}>
                <ringGeometry args={[2, 2.3, 16]} />
                <meshStandardMaterial color={colors[1]} />
            </mesh>

            {/* Pattern Layer 2 (Star/Flower shape simulation via circles) */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <mesh key={i} position={[Math.cos(angle * Math.PI / 180) * 1.2, Math.sin(angle * Math.PI / 180) * 1.2, 0.02]}>
                    <circleGeometry args={[0.5, 16]} />
                    <meshStandardMaterial color={colors[0]} />
                </mesh>
            ))}

            {/* Center Dot */}
            <mesh position={[0, 0, 0.03]}>
                <circleGeometry args={[0.8, 32]} />
                <meshStandardMaterial color={colors[1]} emissive={colors[1]} emissiveIntensity={0.2} />
            </mesh>
        </group>
    );
};

export default Rangoli;
