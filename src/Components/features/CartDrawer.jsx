import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { Button } from '../ui/Button';

const CartDrawer = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();

    const handleCheckout = async () => {
        if (cartItems.length === 0) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("Please login to checkout");
                return;
            }

            const res = await fetch('http://localhost:5001/payment/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ products: cartItems })
            });

            const data = await res.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No Stripe URL returned", data);
                alert("Failed to initiate payment");
            }
        } catch (err) {
            console.error("Checkout failed", err);
            alert("Checkout failed");
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-unity-dark border-l border-white/10 z-[101] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
                            <div className="flex items-center gap-3">
                                <ShoppingBag className="text-unity-saffron" />
                                <h2 className="text-xl font-display text-white">Your Cart</h2>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                            {cartItems.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                                    <ShoppingBag size={48} className="mb-4 opacity-20" />
                                    <p>Your cart is empty</p>
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => setIsCartOpen(false)}
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item._id} className="flex gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover rounded-md border border-white/10"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-white font-medium text-sm line-clamp-1">{item.title}</h3>
                                            <p className="text-gray-400 text-xs mb-2">₹{item.price}</p>

                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 bg-black/40 rounded-full px-2 py-1 border border-white/10">
                                                    <button
                                                        onClick={() => updateQuantity(item._id, -1)}
                                                        className="text-gray-400 hover:text-white disabled:opacity-50"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-white text-xs w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item._id, 1)}
                                                        className="text-gray-400 hover:text-white"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item._id)}
                                                    className="text-red-400 hover:text-red-300 p-1"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cartItems.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black/20">
                                <div className="flex justify-between items-center mb-4 text-lg font-bold text-white">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <Button
                                    variant="primary"
                                    className="w-full py-3 text-base"
                                    onClick={handleCheckout}
                                >
                                    Checkout Now
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;
