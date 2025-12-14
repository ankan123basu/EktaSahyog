import React from 'react';
import { motion } from 'framer-motion';

const BackgroundBeams = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Beam 1 - Saffron */}
            <motion.div
                animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] bg-unity-saffron/10 rounded-full blur-[120px] mix-blend-screen"
            />

            {/* Beam 2 - Emerald */}
            <motion.div
                animate={{
                    rotate: [360, 0],
                    scale: [1.2, 1, 1.2],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-unity-emerald/10 rounded-full blur-[100px] mix-blend-screen"
            />

            {/* Beam 3 - Indigo */}
            <motion.div
                animate={{
                    x: [-100, 100, -100],
                    y: [-50, 50, -50],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-unity-indigo/20 rounded-full blur-[150px] mix-blend-screen"
            />

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
    );
};

export default BackgroundBeams;
