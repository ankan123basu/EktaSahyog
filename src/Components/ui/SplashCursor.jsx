import React, { useEffect, useRef } from 'react';

const SplashCursor = () => {
    const canvasRef = useRef(null);
    const pointers = useRef([]);
    const ctx = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        ctx.current = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const handleMouseMove = (e) => {
            pointers.current.push({
                x: e.clientX,
                y: e.clientY,
                radius: Math.random() * 25 + 10,
                color: `hsla(${Math.random() * 60 + 30}, 100%, 50%, 0.5)`, // Gold/Orange hues
                life: 100
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        const animate = () => {
            if (!ctx.current) return;
            ctx.current.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < pointers.current.length; i++) {
                const p = pointers.current[i];
                ctx.current.beginPath();
                ctx.current.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.current.fillStyle = p.color;
                ctx.current.fill();

                p.life -= 2;
                p.radius *= 0.95;

                if (p.life <= 0) {
                    pointers.current.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
        />
    );
};

export default SplashCursor;
