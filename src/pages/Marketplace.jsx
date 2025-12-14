import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Tag, Plus, ShoppingBag, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../Components/features/ProductCard';
import AddProductModal from '../Components/features/AddProductModal';
import ProductDetailsModal from '../Components/features/ProductDetailsModal';
import { Button } from '../Components/ui/Button';
import bg1 from '../Images/wmremove-transformed.png';

const CATEGORIES = ["All", "Textiles", "Handicrafts", "Art", "Food", "Decor"];

const Marketplace = () => {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const { addToCart, clearCart } = useCart();
    const location = useLocation();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('token');

    // Handle Payment Success
    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('success')) {
            setShowSuccessModal(true);
            clearCart();
            // Clean URL
            navigate('/marketplace', { replace: true });
        }
    }, [location.search, clearCart, navigate]);

    // Fetch Products from Backend
    const fetchProducts = async () => {
        try {
            const res = await fetch('http://localhost:5001/marketplace');
            const data = await res.json();
            setAllProducts(data);
            setProducts(data);
        } catch (err) {
            console.error("Failed to fetch products", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        let filtered = allProducts;
        if (selectedCategory !== "All") {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.region.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        setProducts(filtered);
    }, [selectedCategory, searchQuery, allProducts]);

    const handleMessage = (product) => {
        setSelectedProduct(product);
        setIsDetailsModalOpen(true);
    };

    const handleAddToCart = (product) => {
        if (!isLoggedIn) {
            alert("Please login to add items to cart");
            return;
        }
        addToCart(product);
    };

    // Purchase Flow State
    const [purchaseModal, setPurchaseModal] = useState({
        show: false,
        type: 'confirm', // 'confirm' | 'success' | 'error' | 'loading'
        product: null,
        message: ''
    });

    const handleBuyWithPoints = (product) => {
        if (!isLoggedIn) {
            setPurchaseModal({
                show: true,
                type: 'error',
                message: "Please login to use points."
            });
            return;
        }

        // Open Confirmation Modal
        setPurchaseModal({
            show: true,
            type: 'confirm',
            product: product,
            message: `Are you sure you want to buy "${product.title}" for ${product.pointsPrice || 10000} points?`
        });
    };

    const confirmPurchase = async () => {
        const product = purchaseModal.product;
        if (!product) return;

        setPurchaseModal(prev => ({ ...prev, type: 'loading' }));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://localhost:5001/marketplace/buy-with-points', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ productId: product._id })
            });

            const data = await res.json();

            if (res.ok) {
                setPurchaseModal({
                    show: true,
                    type: 'success',
                    product: product,
                    message: `Success! You bought ${product.title}. Remaining Points: ${data.remainingPoints}`
                });
                // Optional: Refresh products or user points if stored in context
            } else {
                setPurchaseModal({
                    show: true,
                    type: 'error',
                    product: product,
                    message: data.message || "Purchase failed"
                });
            }
        } catch (err) {
            console.error("Error buying with points:", err);
            setPurchaseModal({
                show: true,
                type: 'error',
                message: "Something went wrong. Please try again."
            });
        }
    };

    const closePurchaseModal = () => {
        setPurchaseModal({ show: false, type: 'confirm', product: null, message: '' });
        if (purchaseModal.type === 'success') {
            setShowSuccessModal(false); // Ensure conflict avoidance
            // Logic to clear cart or refresh data if needed
            fetchProducts();
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-unity-dark relative overflow-hidden">
            {/* Custom Purchase Modal */}
            {purchaseModal.show && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-unity-dark border border-white/10 w-full max-w-md p-6 rounded-2xl relative shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                        {/* Close Button (only for error/success) */}
                        {purchaseModal.type !== 'loading' && (
                            <button onClick={closePurchaseModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        )}

                        {/* Icon & Title based on Type */}
                        <div className="text-center mb-6">
                            {purchaseModal.type === 'confirm' && (
                                <div className="w-16 h-16 bg-unity-saffron/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingBag className="w-8 h-8 text-unity-saffron" />
                                </div>
                            )}
                            {purchaseModal.type === 'success' && (
                                <div className="w-16 h-16 bg-unity-emerald/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-unity-emerald" />
                                </div>
                            )}
                            {purchaseModal.type === 'error' && (
                                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Filter className="w-8 h-8 text-red-500 rotate-45" /> {/* Using Filter as X icon proxy or can import XCircle */}
                                </div>
                            )}
                            {purchaseModal.type === 'loading' && (
                                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                                </div>
                            )}

                            <h3 className="text-2xl font-display text-white mb-2">
                                {purchaseModal.type === 'confirm' && 'Confirm Purchase'}
                                {purchaseModal.type === 'success' && 'Purchase Successful!'}
                                {purchaseModal.type === 'error' && 'Something went wrong'}
                                {purchaseModal.type === 'loading' && 'Processing...'}
                            </h3>

                            <p className="text-gray-300 text-lg leading-relaxed">
                                {purchaseModal.message}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-center">
                            {purchaseModal.type === 'confirm' && (
                                <>
                                    <Button variant="outline" onClick={closePurchaseModal} className="flex-1">
                                        Cancel
                                    </Button>
                                    <Button variant="primary" onClick={confirmPurchase} className="flex-1 shadow-[0_0_20px_rgba(255,153,51,0.3)]">
                                        Confirm
                                    </Button>
                                </>
                            )}
                            {(purchaseModal.type === 'success' || purchaseModal.type === 'error') && (
                                <Button variant="primary" onClick={closePurchaseModal} className="w-full">
                                    {purchaseModal.type === 'success' ? 'View Order' : 'Close'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal (Legacy/Stripe) */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-unity-dark border border-unity-emerald/50 w-full max-w-md p-8 rounded-2xl text-center relative shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                        <div className="w-20 h-20 bg-unity-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-unity-emerald" />
                        </div>
                        <h2 className="text-3xl font-display text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-400 mb-8">Thank you for your purchase. Your contribution supports our artisans.</p>
                        <Button variant="primary" onClick={() => setShowSuccessModal(false)} className="w-full">
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            )}

            {/* Background Elements */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-unity-saffron/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-unity-indigo/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center md:text-left mb-6">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-4">
                        CULTURAL MARKETPLACE
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-6">
                    <div className="max-w-2xl">
                        <p className="text-xl text-gray-300">
                            Discover authentic handicrafts, handlooms, and regional treasures directly from artisans across India.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
                        <div className="relative group flex-1 md:w-auto">
                            <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4 group-focus-within:text-unity-saffron transition-colors" />
                            <input
                                type="text"
                                placeholder="Search products, states..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-6 text-white focus:border-unity-saffron focus:ring-1 focus:ring-unity-saffron focus:outline-none w-full md:w-72 transition-all"
                            />
                        </div>

                        {isLoggedIn && (
                            <Button variant="accent" onClick={() => setIsModalOpen(true)} className="rounded-full shadow-lg hover:shadow-unity-saffron/20 whitespace-nowrap">
                                <Plus size={18} className="mr-2" /> List Item
                            </Button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 space-y-4">
                        <div className="bg-white/5 rounded-xl p-6 border border-white/10 backdrop-blur-sm">
                            <h3 className="font-display text-sm text-unity-saffron mb-6 flex items-center gap-2 tracking-wider">
                                <Tag size={14} /> CATEGORIES
                            </h3>
                            <div className="space-y-2">
                                {CATEGORIES.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => setSelectedCategory(category)}
                                        className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-300 ${selectedCategory === category
                                            ? 'bg-unity-indigo text-white shadow-md translate-x-1'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Grid */}
                    <main className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onMessage={handleMessage}
                                    onAddToCart={handleAddToCart}
                                    onBuyWithPoints={handleBuyWithPoints}
                                />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-4">
                                    <Search className="w-8 h-8 text-gray-500" />
                                </div>
                                <h3 className="text-xl text-white font-display mb-2">No products found</h3>
                                <p className="text-gray-400">Try adjusting your search or category filter.</p>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <AddProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onProductAdded={fetchProducts}
            />

            <ProductDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                product={selectedProduct}
                onBuy={handleAddToCart}
            />
        </div>
    );
};

export default Marketplace;
