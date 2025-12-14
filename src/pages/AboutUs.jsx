import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import ElectricBorder from '../Components/ui/ElectricBorder';
import bg1 from '../Images/wmremove-transformed.png';

const developers = [
    {
        name: "Ankan",
        role: "Full Stack Developer",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankan", // Placeholder
        bio: "Passionate about building scalable web applications and AI integration.",
        socials: {
            github: "#",
            linkedin: "#",
            twitter: "#"
        }
    },
    {
        name: "Dev 2",
        role: "Frontend Specialist",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dev2", // Placeholder
        bio: "Crafting beautiful and responsive user interfaces with modern technologies.",
        socials: {
            github: "#",
            linkedin: "#",
            twitter: "#"
        }
    },
    // Add more developers as needed
];

const AboutUs = () => {
    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-unity-dark relative overflow-hidden">
            {/* Background Image Overlay */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-display text-white mb-4"
                    >
                        MEET THE TEAM
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        The minds behind EktaSahyog, dedicated to fostering unity through technology.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    {developers.map((dev, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <ElectricBorder color={index % 2 === 0 ? "#4338ca" : "#f59e0b"}>
                                <div className="bg-black/40 backdrop-blur-md p-8 rounded-xl border border-white/10 flex flex-col items-center text-center group hover:bg-black/60 transition-colors">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/10 mb-6 group-hover:border-unity-saffron transition-colors shadow-2xl">
                                        <img src={dev.image} alt={dev.name} className="w-full h-full object-cover" />
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-1">{dev.name}</h3>
                                    <p className="text-unity-saffron text-sm font-medium mb-4 uppercase tracking-wider">{dev.role}</p>

                                    <p className="text-gray-300 mb-6 leading-relaxed">
                                        {dev.bio}
                                    </p>

                                    <div className="flex gap-4">
                                        <a href={dev.socials.github} className="text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                                            <Github size={20} />
                                        </a>
                                        <a href={dev.socials.linkedin} className="text-gray-400 hover:text-blue-400 transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                                            <Linkedin size={20} />
                                        </a>
                                        <a href={dev.socials.twitter} className="text-gray-400 hover:text-sky-400 transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                                            <Twitter size={20} />
                                        </a>
                                    </div>
                                </div>
                            </ElectricBorder>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
