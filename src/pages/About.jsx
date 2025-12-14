import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Award, BookOpen, Heart, Code, Palette, Database } from 'lucide-react';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import ElectricBorder from '../Components/ui/ElectricBorder';
import VariableProximity from '../Components/ui/VariableProximity';
import bg1 from '../Images/wmremove-transformed.png';
import ankanImg from '../Images/Screenshot 2025-12-04 223022.png';
import sachinImg from '../Images/Screenshot 2025-12-04 223409.png';
import snehaImg from '../Images/Screenshot 2025-12-04 223233.png';

const DeveloperCard = ({ name, role, icon: Icon, delay, color = "#FF9933", image, linkedin, github, imagePosition = "object-cover" }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="h-full"
    >
        <ElectricBorder color={color}>
            <div className="bg-black/40 backdrop-blur-xl p-8 rounded-xl h-full border border-white/10 flex flex-col items-center text-center group hover:bg-white/5 transition-colors relative overflow-hidden">
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ '--tw-gradient-from': `${color}10` }} />

                <div className="w-32 h-32 rounded-full overflow-hidden border-2 mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all relative z-10 bg-black/50 flex items-center justify-center" style={{ borderColor: color }}>
                    {image ? (
                        <img src={image} alt={name} className={`w-full h-full ${imagePosition}`} />
                    ) : (
                        <span className="text-4xl font-display" style={{ color: color }}>{name.charAt(0)}</span>
                    )}
                </div>

                <h3 className="text-2xl font-display font-bold text-white mb-2 relative z-10">{name}</h3>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                    <Icon className="w-4 h-4" style={{ color: color }} />
                    <p className="text-gray-300 text-sm font-medium">{role}</p>
                </div>

                <div className="flex space-x-4 mt-auto relative z-10">
                    {github && (
                        <motion.a
                            href={github}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white cursor-pointer transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </motion.a>
                    )}
                    {linkedin && (
                        <motion.a
                            href={linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-[#0077b5] cursor-pointer transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </motion.a>
                    )}
                    <motion.a whileHover={{ scale: 1.1 }} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-red-400 cursor-pointer transition-colors">
                        <Mail className="w-5 h-5" />
                    </motion.a>
                </div>
            </div>
        </ElectricBorder>
    </motion.div>
);

const About = () => {
    const containerRef = useRef(null);

    return (
        <div className="min-h-screen pt-20 relative overflow-hidden bg-unity-dark" ref={containerRef}>
            {/* Background */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            <BackgroundBeams />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
                {/* Header */}
                <div className="text-center mb-24">
                    <div className="cursor-default">
                        <VariableProximity
                            label="ABOUT US"
                            className="text-5xl md:text-7xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl"
                            fromFontVariationSettings="'wght' 400, 'opsz' 9"
                            toFontVariationSettings="'wght' 900, 'opsz' 40"
                            radius={100}
                            falloff="linear"
                            containerRef={containerRef}
                        />
                    </div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Building bridges between communities, preserving heritage, and fostering unity through technology.
                    </motion.p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-unity-saffron to-orange-600 flex items-center justify-center mr-6 shadow-lg shadow-orange-500/20">
                                <Heart className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-display text-white">Why We Built This</h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg">
                            In a diverse nation like India, cultural richness is our greatest strength, but it can sometimes lead to fragmentation.
                            We noticed a gap in digital platforms—there wasn't a dedicated space that truly celebrated this diversity while actively fostering collaboration.
                            <span className="text-white font-medium"> EktaSahyog</span> was born from the desire to create that space: a digital home where every culture is honored, and every Indian can connect.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white/5 p-10 rounded-3xl border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors"
                    >
                        <div className="flex items-center mb-8">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-unity-emerald to-green-600 flex items-center justify-center mr-6 shadow-lg shadow-green-500/20">
                                <Award className="w-7 h-7 text-white" />
                            </div>
                            <h2 className="text-3xl font-display text-white">Our Outcomes</h2>
                        </div>
                        <ul className="space-y-6 text-gray-300">
                            <li className="flex items-start group">
                                <span className="w-2 h-2 bg-unity-emerald rounded-full mt-2.5 mr-4 shrink-0 group-hover:scale-150 transition-transform" />
                                <span className="text-lg">Connected over <span className="text-white font-bold">50+ artisan communities</span> directly with global buyers.</span>
                            </li>
                            <li className="flex items-start group">
                                <span className="w-2 h-2 bg-unity-emerald rounded-full mt-2.5 mr-4 shrink-0 group-hover:scale-150 transition-transform" />
                                <span className="text-lg">Facilitated cross-cultural dialogue through our <span className="text-white font-bold">real-time translation chat</span>.</span>
                            </li>
                            <li className="flex items-start group">
                                <span className="w-2 h-2 bg-unity-emerald rounded-full mt-2.5 mr-4 shrink-0 group-hover:scale-150 transition-transform" />
                                <span className="text-lg">Created a living digital archive of India's <span className="text-white font-bold">intangible cultural heritage</span>.</span>
                            </li>
                        </ul>
                    </motion.div>
                </div>

                {/* Team Section */}
                <div className="mb-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display text-white mb-4">Meet the <span className="text-unity-emerald">Creators</span></h2>
                        <p className="text-gray-400 text-lg mb-2">The minds behind the mission</p>
                        <p className="text-unity-saffron font-medium tracking-wide">Lovely Professional University</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <DeveloperCard
                            name="Ankan Basu"
                            role="Aspiring Software Developer"
                            icon={Code}
                            delay={0}
                            color="#FF9933"
                            image={ankanImg}
                            linkedin="https://www.linkedin.com/in/ankanbasu10/"
                            github="https://github.com/ankan123basu"
                            imagePosition="object-top"
                        />
                        <DeveloperCard
                            name="Sachin Burnwal"
                            role="Aspiring Software Developer"
                            icon={Palette}
                            delay={0.2}
                            color="#FFFFFF"
                            image={sachinImg}
                            linkedin="https://www.linkedin.com/in/sachinburnwal1/"
                        />
                        <DeveloperCard
                            name="Sneha Singh"
                            role="Aspiring Software Developer"
                            icon={Database}
                            delay={0.4}
                            color="#138808"
                            image={snehaImg}
                            linkedin="https://www.linkedin.com/in/sneha-singh-01b053294/"
                        />
                    </div>
                </div>

                {/* Legal & Safety Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    {/* Guidelines */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/10 transition-all"
                    >
                        <div className="w-12 h-12 bg-unity-saffron/20 rounded-xl flex items-center justify-center mb-6">
                            <BookOpen className="w-6 h-6 text-unity-saffron" />
                        </div>
                        <h3 className="text-xl font-display text-white mb-4">Community Guidelines</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            We foster a space of respect and unity. Hate speech, discrimination, or political polarization is strictly prohibited.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-2 mb-6">
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-unity-saffron rounded-full mr-2"></span>Respect all cultures</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-unity-saffron rounded-full mr-2"></span>No hate speech</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-unity-saffron rounded-full mr-2"></span>Constructive dialogue only</li>
                        </ul>
                    </motion.div>

                    {/* Safety */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/10 transition-all"
                    >
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-xl font-display text-white mb-4">Safety Center</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Your safety is our priority. We use AI to monitor toxicity and provide tools to report inappropriate behavior instantly.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-2 mb-6">
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>AI Toxicity Detection</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>Verified Profiles</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>Secure Reporting</li>
                        </ul>
                    </motion.div>

                    {/* Privacy */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:bg-white/10 transition-all"
                    >
                        <div className="w-12 h-12 bg-unity-emerald/20 rounded-xl flex items-center justify-center mb-6">
                            <Database className="w-6 h-6 text-unity-emerald" />
                        </div>
                        <h3 className="text-xl font-display text-white mb-4">Privacy Policy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            Your data belongs to you. We only store essential info to personalize your experience and never sell your data to third parties.
                        </p>
                        <ul className="text-sm text-gray-400 space-y-2 mb-6">
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-unity-emerald rounded-full mr-2"></span>End-to-end Encryption</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-unity-emerald rounded-full mr-2"></span>Data Ownership</li>
                            <li className="flex items-center"><span className="w-1.5 h-1.5 bg-unity-emerald rounded-full mr-2"></span>Transparent Usage</li>
                        </ul>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default About;
