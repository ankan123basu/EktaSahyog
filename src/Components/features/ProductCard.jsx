import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, MessageCircle, MapPin, Trophy } from 'lucide-react';
import { Button } from '../ui/Button';

const ProductCard = ({ product, onMessage, onAddToCart, onBuyWithPoints }) => {
    return (
        <motion.div
            initial={{ opacity: 0, rotate: -5 }}
            whileInView={{ opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            whileHover={{
                rotate: [0, -2, 2, -1, 1, 0],
                transition: { duration: 0.5 }
            }}
            className="retro-card group overflow-hidden bg-unity-dark origin-top"
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden border-b-2 border-black">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 right-2 bg-unity-saffron text-black font-bold px-2 py-1 text-xs border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-10">
                    ₹{product.price}
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
                    <p className="text-white text-xs font-display flex items-center gap-1">
                        <MapPin size={12} className="text-unity-emerald" /> {product.region}
                        {product.size && <span className="ml-2 text-gray-400">| {product.size}</span>}
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-3">
                <div>
                    <h3 className="text-white font-display text-sm truncate">{product.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">by {product.artisan}</p>
                </div>

                <div className="flex gap-2 pt-2 flex-wrap">
                    <Button variant="primary" size="sm" className="flex-1 text-xs" onClick={() => onAddToCart(product)}>
                        <ShoppingBag size={14} className="mr-1" /> Add to Cart
                    </Button>
                    <Button variant="outline" size="sm" className="px-2" onClick={() => onMessage(product)}>
                        <MessageCircle size={14} />
                    </Button>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs text-unity-saffron hover:text-white hover:bg-unity-saffron/10 border border-unity-saffron/20 mt-2"
                    onClick={() => onBuyWithPoints(product)}
                >
                    <Trophy size={14} className="mr-1" /> Buy for {product.pointsPrice || 10000} Points
                </Button>
            </div>
        </motion.div>
    );
};

export default ProductCard;
