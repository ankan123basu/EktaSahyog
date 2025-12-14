import React, { useState } from 'react';
import { X, Loader2, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        artisan: '',
        region: '',
        category: 'Textiles',
        size: '',
        description: '',
        image: '' // In a real app, this would be a file upload
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            await axios.post('http://localhost:5001/marketplace/create', formData, config);
            onProductAdded();
            onClose();
            setFormData({ title: '', price: '', artisan: '', region: '', category: 'Textiles', size: '', description: '', image: '' });
        } catch (err) {
            console.error("Failed to add product", err);
            alert("Failed to add product. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-unity-dark border border-white/10 w-full max-w-lg retro-card p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-display text-white mb-6">List New Product</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Product Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Price (₹)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Points Price</label>
                            <input
                                type="number"
                                value={formData.pointsPrice || ''}
                                onChange={(e) => setFormData({ ...formData, pointsPrice: e.target.value })}
                                placeholder="e.g. 500"
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            >
                                <option>Textiles</option>
                                <option>Handicrafts</option>
                                <option>Art</option>
                                <option>Sweets</option>
                                <option>Decor</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Size / Weight (Optional)</label>
                        <input
                            type="text"
                            value={formData.size}
                            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                            placeholder="e.g., M, L, 1 kg, 500g, 10x10 cm"
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Brand / Artisan Name</label>
                            <input
                                type="text"
                                value={formData.artisan}
                                onChange={(e) => setFormData({ ...formData, artisan: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Region</label>
                            <input
                                type="text"
                                value={formData.region}
                                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none h-20"
                        />
                    </div>

                    <Button variant="primary" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
                        List Product
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;
