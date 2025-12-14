import React from 'react';
import BackgroundBeams from '../ui/BackgroundBeams';
import bg1 from '../../Images/bg1.png';

const PageBackground = ({ children, className = "" }) => {
    return (
        <div className={`relative min-h-screen bg-unity-dark overflow-hidden ${className}`}>
            {/* Background Image Overlay */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/60 to-unity-dark" />
            </div>

            <BackgroundBeams />
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
};

export default PageBackground;
