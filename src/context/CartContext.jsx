import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const getUserId = () => localStorage.getItem('userId') || 'guest';

    const [cartItems, setCartItems] = useState(() => {
        const userId = getUserId();
        const savedCart = localStorage.getItem(`cartItems_${userId}`);
        return savedCart ? JSON.parse(savedCart) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);

    // Update cart when user changes (login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            const userId = getUserId();
            const savedCart = localStorage.getItem(`cartItems_${userId}`);
            setCartItems(savedCart ? JSON.parse(savedCart) : []);
        };

        window.addEventListener('user-login', handleStorageChange);
        return () => window.removeEventListener('user-login', handleStorageChange);
    }, []);

    useEffect(() => {
        const userId = getUserId();
        localStorage.setItem(`cartItems_${userId}`, JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = useCallback((product) => {
        setCartItems(prev => {
            const existing = prev.find(item => item._id === product._id);
            if (existing) {
                return prev.map(item =>
                    item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    }, []);

    const removeFromCart = useCallback((productId) => {
        setCartItems(prev => prev.filter(item => item._id !== productId));
    }, []);

    const updateQuantity = useCallback((productId, delta) => {
        setCartItems(prev => prev.map(item => {
            if (item._id === productId) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    }, []);

    const clearCart = useCallback(() => {
        setCartItems([]);
    }, []);

    const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            cartTotal,
            cartCount,
            isCartOpen,
            setIsCartOpen
        }}>
            {children}
        </CartContext.Provider>
    );
};
