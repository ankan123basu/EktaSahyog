import React from 'react';
import { X, MapPin, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import ElectricBorder from '../ui/ElectricBorder';

const ProductDetailsModal = ({ isOpen, onClose, product, onBuy }) => {
    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-unity-dark border border-white/10 w-full max-w-2xl retro-card relative overflow-hidden flex flex-col md:flex-row"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-black/50 rounded-full p-1">
                        <X size={24} />
                    </button>

                    {/* Image Section */}
                    <div className="w-full md:w-1/2 relative">
                        <div className="h-64 md:h-full w-full">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
                        </div>
                        <div className="absolute bottom-4 left-4 md:bottom-auto md:top-4 md:left-4">
                            <span className="bg-unity-saffron text-black font-bold px-3 py-1 text-sm border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                ₹{product.price}
                            </span>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
                        <div className="mb-auto">
                            <div className="flex items-center gap-2 text-unity-emerald text-sm font-display mb-2">
                                <MapPin size={14} />
                                <span>{product.region}</span>
                                {product.size && <span className="text-gray-400">| Size: {product.size}</span>}
                            </div>

                            <h2 className="text-2xl md:text-3xl font-display text-white mb-2">{product.title}</h2>
                            <p className="text-gray-400 text-sm mb-6">by <span className="text-white">{product.artisan}</span></p>

                            <div className="prose prose-invert prose-sm max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                <p className="text-gray-300 leading-relaxed">
                                    {product.description || "No description available for this masterpiece."}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <Button variant="primary" className="w-full" onClick={() => onBuy(product)}>
                                <ShoppingBag className="mr-2 w-4 h-4" />
                                Buy Now
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ProductDetailsModal;
