import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PointerLockControls, Sparkles, Cloud, Text, Stars, Html } from '@react-three/drei';
import axios from 'axios';
import Stall from '../Components/metaverse/Stall';
import ProductDetailsModal from '../Components/features/ProductDetailsModal';
import Rangoli from '../Components/metaverse/Rangoli';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import * as THREE from 'three';
import confetti from 'canvas-confetti';

// --- NEW: RISING SKY LANTERNS ---
function SkyLanterns() {
    const count = 100;
    const mesh = useRef();

    // Generate random initial positions
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const t = Math.random() * 100;
            const factor = 20 + Math.random() * 100;
            const speed = 0.01 + Math.random() / 200;
            const xFactor = -50 + Math.random() * 100;
            const yFactor = -50 + Math.random() * 100;
            const zFactor = -50 + Math.random() * 100;
            temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    useFrame((state) => {
        if (!mesh.current) return;
        particles.forEach((particle, i) => {
            let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
            // Move up
            particle.t += speed / 2;
            const tCurr = particle.t;
            const a = Math.cos(tCurr) + Math.sin(tCurr * 1) / 10;
            const b = Math.sin(tCurr) + Math.cos(tCurr * 2) / 10;
            const s = Math.cos(tCurr);

            // Update position (Rising upward)
            particle.my = (particle.my + speed) % 50; // Reset height after 50 units

            dummy.position.set(
                (particle.mx / 10) * a + xFactor + Math.cos((tCurr / 10) * factor) + (Math.sin(tCurr * 1) * factor) / 10,
                particle.my + yFactor + 10, // Start higher up
                (particle.my / 10) * b + zFactor + Math.cos((tCurr / 10) * factor) + (Math.sin(tCurr * 2) * factor) / 10
            );
            dummy.scale.set(1, 1.2, 1); // Lantern shape (slightly tall)
            dummy.rotation.set(s * 5, s * 5, s * 5);
            dummy.updateMatrix();

            mesh.current.setMatrixAt(i, dummy.matrix);
        });
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]}>
            <cylinderGeometry args={[0.2, 0.15, 0.4, 8]} />
            <meshStandardMaterial color="#FF4500" emissive="#FF6600" emissiveIntensity={4} transparent opacity={0.8} />
        </instancedMesh>
    );
}

// --- COMPONENTS ---

const VillageBanner = () => (
    <group position={[0, 7, -10]}>
        <mesh position={[-6, -4, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 10]} />
            <meshStandardMaterial color="#3E2723" />
        </mesh>
        <mesh position={[6, -4, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 10]} />
            <meshStandardMaterial color="#3E2723" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[14, 3, 0.2]} />
            <meshStandardMaterial color="#8B0000" />
        </mesh>
        <mesh position={[0, 0, 0]}>
            <boxGeometry args={[14.2, 3.2, 0.1]} />
            <meshStandardMaterial color="#FFD700" />
        </mesh>
        <Text position={[0, 0.5, 0.2]} fontSize={1.2} color="#FFD700" anchorX="center" anchorY="middle" fontWeight="bold" outlineWidth={0.05} outlineColor="#000">
            EktaSahyog Bazaar
        </Text>
        <Text position={[0, -0.7, 0.2]} fontSize={0.5} color="#FFF" anchorX="center" anchorY="middle" outlineWidth={0.02} outlineColor="#000">
            Heritage • Culture • Unity
        </Text>
    </group>
);

function Player({ isLocked }) {
    const { camera } = useThree();
    const moveSpeed = 0.3;
    const direction = useRef(new THREE.Vector3());
    const frontVector = useRef(new THREE.Vector3());
    const sideVector = useRef(new THREE.Vector3());

    const [move, setMove] = useState({ forward: false, backward: false, left: false, right: false });

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.code) {
                case "ArrowUp": case "KeyW": setMove(m => ({ ...m, forward: true })); break;
                case "ArrowLeft": case "KeyA": setMove(m => ({ ...m, left: true })); break;
                case "ArrowDown": case "KeyS": setMove(m => ({ ...m, backward: true })); break;
                case "ArrowRight": case "KeyD": setMove(m => ({ ...m, right: true })); break;
            }
        };
        const handleKeyUp = (e) => {
            switch (e.code) {
                case "ArrowUp": case "KeyW": setMove(m => ({ ...m, forward: false })); break;
                case "ArrowLeft": case "KeyA": setMove(m => ({ ...m, left: false })); break;
                case "ArrowDown": case "KeyS": setMove(m => ({ ...m, backward: false })); break;
                case "ArrowRight": case "KeyD": setMove(m => ({ ...m, right: false })); break;
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    useFrame(() => {
        if (!isLocked) return;
        frontVector.current.set(0, 0, Number(move.backward) - Number(move.forward));
        sideVector.current.set(Number(move.left) - Number(move.right), 0, 0);
        direction.current.subVectors(frontVector.current, sideVector.current).normalize().multiplyScalar(moveSpeed).applyEuler(camera.rotation);
        camera.position.add(direction.current);
        camera.position.y = 1.7;
    });
    return null;
}

const Visitor = ({ position, color }) => {
    const ref = useRef();
    const headRef = useRef();
    const offset = useMemo(() => Math.random() * 100, []);

    useFrame((state) => {
        const t = state.clock.getElapsedTime() + offset;
        if (ref.current) {
            ref.current.rotation.y = Math.sin(t * 0.5) * 0.2;
            ref.current.rotation.z = Math.sin(t * 1) * 0.05;
        }
        if (headRef.current) {
            headRef.current.rotation.y = Math.sin(t * 0.3) * 0.5;
        }
    });

    return (
        <group ref={ref} position={position}>
            <mesh position={[0, 0.75, 0]}>
                <cylinderGeometry args={[0.3, 0.4, 1.5]} />
                <meshStandardMaterial color={color} />
            </mesh>
            <group ref={headRef} position={[0, 1.6, 0]}>
                <mesh>
                    <sphereGeometry args={[0.25, 16, 16]} />
                    <meshStandardMaterial color="#8D5524" />
                </mesh>
            </group>
        </group>
    );
};

// --- GIANT WHEEL ---
function GiantWheel() {
    const wheelRef = useRef();
    useFrame((state, delta) => {
        if (wheelRef.current) wheelRef.current.rotation.z -= delta * 0.2;
    });

    const lights = useMemo(() => {
        return new Array(12).fill(0).map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            return [Math.cos(angle) * 18, Math.sin(angle) * 18, 0];
        });
    }, []);

    return (
        <group position={[0, 20, -60]} rotation={[0, -0.2, 0]} scale={1.5}>
            <group ref={wheelRef}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <torusGeometry args={[18, 0.5, 16, 100]} />
                    <meshStandardMaterial color="#FF4500" emissive="#FF4500" emissiveIntensity={3} />
                </mesh>
                {lights.map((pos, i) => (
                    <group key={i}>
                        <mesh position={pos}>
                            <sphereGeometry args={[1]} />
                            <meshStandardMaterial color={i % 2 === 0 ? "cyan" : "magenta"} emissive={i % 2 === 0 ? "cyan" : "magenta"} emissiveIntensity={4} />
                        </mesh>
                        <mesh rotation={[0, 0, (i / 12) * Math.PI * 2]} position={[pos[0] / 2, pos[1] / 2, 0]}>
                            <boxGeometry args={[18, 0.2, 0.2]} />
                            <meshStandardMaterial color="white" />
                        </mesh>
                    </group>
                ))}
            </group>
            <mesh position={[-8, -20, 0]} rotation={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.5, 2, 40]} />
                <meshStandardMaterial color="#444" />
            </mesh>
            <mesh position={[8, -20, 0]} rotation={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.5, 2, 40]} />
                <meshStandardMaterial color="#444" />
            </mesh>
        </group>
    );
}

// --- FIREWORKS SYSTEM ---
function Firework({ position, color }) {
    const ref = useRef();
    const lightRef = useRef();
    useFrame((state) => {
        if (ref.current) {
            ref.current.position.y += 0.05;
            ref.current.scale.x += 0.02;
            ref.current.scale.y += 0.02;
            ref.current.scale.z += 0.02;
            ref.current.material.opacity -= 0.01;

            if (lightRef.current) {
                lightRef.current.intensity = Math.max(0, ref.current.material.opacity * 10);
            }

            if (ref.current.material.opacity <= 0) {
                ref.current.position.y = position[1];
                ref.current.material.opacity = 1;
                ref.current.scale.set(1, 1, 1);
            }
        }
    });

    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color={color} transparent toneMapped={false} />
            <pointLight ref={lightRef} distance={20} color={color} decay={2} />
            <Sparkles count={150} scale={5} size={8} speed={0.4} opacity={1} color={color} />
        </mesh>
    );
}

// --- MAIN PAGE ---
const Metaverse = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [isLocked, setIsLocked] = useState(false);
    const navigate = useNavigate();

    // --- FIX: SAFETY TRIGGER ---
    const clickSafety = useRef(false);

    useEffect(() => {
        if (isLocked) {
            clickSafety.current = false;
            const timer = setTimeout(() => {
                clickSafety.current = true;
            }, 500);
            return () => clearTimeout(timer);
        } else {
            clickSafety.current = false;
        }
    }, [isLocked]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5001/marketplace');
                if (Array.isArray(res.data)) setProducts(res.data);
                else setProducts([]);
            } catch (err) {
                console.error("Fetch failed", err);
                setProducts([]);
            }
        };
        fetchProducts();
    }, []);

    const visitors = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * 40;
            const z = (Math.random() - 0.5) * 30 - 15;
            const colors = ["#E91E63", "#9C27B0", "#2196F3", "#4CAF50", "#FF9800"];
            temp.push({
                pos: [x, 0, z],
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
        return temp;
    }, []);

    const grassRangolis = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 15; i++) {
            const x = (Math.random() - 0.5) * 80;
            const z = (Math.random() - 0.5) * 80;
            if (Math.abs(x) > 5 || Math.abs(z) > 10) {
                temp.push({
                    pos: [x, 0, z],
                    scale: 0.5 + Math.random() * 0.8,
                    seed: Math.floor(Math.random() * 10)
                });
            }
        }
        return temp;
    }, []);

    useEffect(() => {
        if (selectedProduct) {
            document.exitPointerLock();
            setIsLocked(false);
            clickSafety.current = false;
        }
    }, [selectedProduct]);

    const getPosition = (index) => {
        const spacing = 15;
        const perRow = 4;
        const row = Math.floor(index / perRow);
        const col = index % perRow;
        const x = (col * spacing) - ((perRow * spacing) / 2) + spacing / 2 + (row % 2 === 0 ? 0 : 7);
        const z = (row * spacing) * -1 - 12;
        return [x, 0, z];
    };

    return (
        <div className="fixed inset-0 z-[100] w-full h-screen bg-[#2a1b3e] font-sans">

            {/* EXIT BUTTON */}
            <div className="absolute top-8 right-8 z-[60] pointer-events-auto">
                <button
                    onClick={() => {
                        setIsLocked(false);
                        document.exitPointerLock();
                        navigate('/marketplace');
                    }}
                    className="bg-red-600/90 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 backdrop-blur-sm"
                >
                    <LogOut size={18} /> Leave Bazaar
                </button>
            </div>

            {/* CROSSHAIR */}
            {isLocked && !selectedProduct && <div style={{ position: "absolute", top: "50%", left: "50%", width: "8px", height: "8px", background: "white", borderRadius: "50%", transform: "translate(-50%, -50%)", zIndex: 10, pointerEvents: "none", mixBlendMode: "difference" }} />}

            {/* --- CLICK LISTENER LAYER --- */}
            {!isLocked && !selectedProduct && (
                <div
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsLocked(true);
                    }}
                    style={{
                        position: 'absolute',
                        inset: 0,
                        zIndex: 50,
                        cursor: 'pointer',
                        background: 'transparent'
                    }}
                />
            )}

            <Canvas shadows camera={{ fov: 60, position: [0, 1.7, 12] }}>
                <Suspense fallback={
                    <Html center>
                        <div className="flex flex-col items-center justify-center w-screen h-screen bg-[#1a0b2e] z-[1000]">
                            <h2 className="text-4xl text-[#FFD700] font-serif animate-pulse mb-4">Loading Bazaar...</h2>
                        </div>
                    </Html>
                }>
                    <color attach="background" args={['#2a1b3e']} />
                    <fog attach="fog" args={['#2a1b3e', 10, 90]} />
                    <ambientLight intensity={1.0} color="#bbaadd" />
                    <directionalLight position={[-10, 20, -10]} intensity={1.0} color="#e0d0e0" castShadow />
                    <Stars radius={100} depth={50} count={7000} factor={4} saturation={0.5} fade speed={1} />
                    <Cloud opacity={0.3} speed={0.2} width={60} depth={5} segments={20} position={[0, 25, -50]} color="#ff90b3" />

                    {/* --- NEW: SKY LANTERNS --- */}
                    <SkyLanterns />

                    <Firework position={[-20, 15, -30]} color="red" />
                    <Firework position={[0, 20, -40]} color="gold" />
                    <Firework position={[20, 18, -30]} color="cyan" />

                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                        <planeGeometry args={[200, 200]} />
                        <meshStandardMaterial color="#355e22" roughness={0.8} />
                    </mesh>

                    <VillageBanner />
                    <GiantWheel />

                    {visitors.map((v, i) => (
                        <Visitor key={i} position={v.pos} color={v.color} />
                    ))}

                    {grassRangolis.map((g, i) => (
                        <Rangoli key={`g-${i}`} position={g.pos} scale={g.scale} seed={g.seed} />
                    ))}

                    <Player isLocked={isLocked} />

                    {isLocked && (
                        <PointerLockControls
                            onUnlock={() => setIsLocked(false)}
                            selector={undefined}
                        />
                    )}

                    {products.map((product, index) => (
                        <Stall
                            key={product._id || index}
                            position={getPosition(index)}
                            product={product}
                            onClick={(p) => {
                                if (!clickSafety.current) return;

                                document.exitPointerLock();
                                setIsLocked(false);
                                setSelectedProduct(p);
                            }}
                            hideOverlay={!!selectedProduct}
                        />
                    ))}

                </Suspense>
            </Canvas>

            {selectedProduct && (
                <div className="relative z-[200]">
                    <ProductDetailsModal
                        isOpen={!!selectedProduct}
                        onClose={() => {
                            setSelectedProduct(null);
                        }}
                        product={selectedProduct}
                        user={user}
                        onBuy={(p) => {
                            // --- NEW: CONFETTI CELEBRATION ---
                            confetti({
                                particleCount: 150,
                                spread: 70,
                                origin: { y: 0.6 },
                                colors: ['#FFD700', '#FF0000', '#00FF00']
                            });
                            addToCart(p);
                            alert("Added to cart!");
                            setSelectedProduct(null);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default Metaverse;
