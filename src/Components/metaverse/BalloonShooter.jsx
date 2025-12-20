import React, { useState, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Html } from '@react-three/drei';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

function Balloon({ position, color, onPop }) {
    const ref = useRef();
    const [popped, setPopped] = useState(false);
    const speed = useMemo(() => 0.02 + Math.random() * 0.03, []);
    const offset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        if (!ref.current || popped) return;
        const time = state.clock.elapsedTime;
        // Float up and sway
        ref.current.position.y += speed;
        ref.current.position.x += Math.sin(time + offset) * 0.01;

        // Reset if too high
        if (ref.current.position.y > 8) {
            ref.current.position.y = 1;
        }
    });

    const handlePop = (e) => {
        e.stopPropagation();
        if (popped) return;
        setPopped(true);
        onPop();
        // Visual Pop (Scale down quickly)
        ref.current.scale.set(0, 0, 0);
    };

    if (popped) return null;

    return (
        <group ref={ref} position={position} onClick={handlePop}>
            {/* Balloon Body */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
            </mesh>
            {/* Balloon Knot */}
            <mesh position={[0, -0.35, 0]}>
                <coneGeometry args={[0.05, 0.1, 8]} rotation={[Math.PI, 0, 0]} />
                <meshStandardMaterial color={color} />
            </mesh>
            {/* String */}
            <mesh position={[0, -0.8, 0]}>
                <cylinderGeometry args={[0.005, 0.005, 1]} />
                <meshBasicMaterial color="white" transparent opacity={0.5} />
            </mesh>
        </group>
    );
}

const BalloonShooter = ({ position }) => {
    const [score, setScore] = useState(0);
    const textRef = useRef();

    // Pulse Animation for Title
    useFrame((state) => {
        if (textRef.current) {
            const t = state.clock.elapsedTime;
            textRef.current.scale.setScalar(1 + Math.sin(t * 3) * 0.05);
        }
    });

    // Generate Balloon Positions
    const balloons = useMemo(() => {
        const colors = ["#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF"];
        const b = [];
        for (let i = 0; i < 15; i++) {
            b.push({
                id: i,
                pos: [(Math.random() - 0.5) * 4, 1 + Math.random() * 3, (Math.random() - 0.5) * 1],
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        return b;
    }, []);

    return (
        <group position={position}>
            {/* Stall Structure */}
            <mesh position={[0, 0.1, 0]}>
                <boxGeometry args={[6, 0.2, 3]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* SOLID BACKBOARD (Black Cover) - Opaque to block view */}
            <mesh position={[0, 4, -1.4]}>
                <planeGeometry args={[6, 8]} />
                <meshStandardMaterial color="#1a202c" side={THREE.DoubleSide} />
            </mesh>

            {/* Sign board */}
            <group position={[0, 5, 0]}>
                <mesh>
                    <boxGeometry args={[5.5, 0.8, 0.1]} />
                    <meshStandardMaterial color="#FFD700" />
                </mesh>
                <Text
                    ref={textRef}
                    position={[0, 0, 0.1]}
                    fontSize={0.4}
                    color="#D32F2F"
                    anchorX="center"
                    anchorY="middle"
                    fontWeight="bold"
                >
                    🎯 Gubbara Fod (Shoot!)
                </Text>
            </group>

            {/* Balloons */}
            <group position={[0, 0, 0]}>
                {balloons.map((b) => (
                    <Balloon
                        key={b.id}
                        position={b.pos}
                        color={b.color}
                        onPop={() => {
                            setScore(s => s + 10);
                            confetti({
                                particleCount: 50,
                                spread: 40,
                                origin: { y: 0.6 },
                                colors: [b.color]
                            });
                        }}
                    />
                ))}
            </group>

            {/* Scoreboard - SOLID (No Transparency) */}
            <Html transform position={[2.2, 2.5, 0]} zIndexRange={[100, 0]}>
                <div className="bg-gray-900 text-white p-4 rounded-lg border-4 border-yellow-400 text-center font-mono shadow-2xl min-w-[150px]">
                    <div className="text-sm text-yellow-400 font-bold mb-1">SCORE</div>
                    <div className="text-4xl font-black text-white">{score}</div>
                </div>
            </Html>
        </group>
    );
};

export default BalloonShooter;
