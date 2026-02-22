import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp, Search, X, Smartphone, Laptop, Headphones, Watch, Gamepad2, Footprints, SlidersHorizontal } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const categoryConfig = [
    { name: 'Smartphones', icon: Smartphone, color: 'text-blue-500' },
    { name: 'Laptops', icon: Laptop, color: 'text-violet-500' },
    { name: 'Audio', icon: Headphones, color: 'text-pink-500' },
    { name: 'Watches', icon: Watch, color: 'text-amber-500' },
    { name: 'Gaming', icon: Gamepad2, color: 'text-emerald-500' },
    { name: 'Footwear', icon: Footprints, color: 'text-red-500' },
];

const Products = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(150000);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [sortBy, setSortBy] = useState('relevance');
    const [searchTerm, setSearchTerm] = useState("");
    const [showCategoryFilter, setShowCategoryFilter] = useState(true);
    const [showRatingFilter, setShowRatingFilter] = useState(true);

    // Read category from URL on mount
    useEffect(() => {
        const urlCategory = searchParams.get('category');
        if (urlCategory) {
            setSelectedCategories([urlCategory]);
        }
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:5001/products');
                const transformed = response.data.map(p => ({
                    ...p,
                    reviews: p.reviews_count,
                    originalPrice: p.original_price,
                    platform: p.ai_recommendation?.store || 'Amazon'
                }));
                setProducts(transformed);
            } catch (err) {
                console.error("Failed to fetch products", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const toggleCategory = (category) => {
        setSelectedCategories(prev => {
            const newCategories = prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category];

            // Update URL params
            if (newCategories.length === 0) {
                searchParams.delete('category');
            } else if (newCategories.length === 1) {
                searchParams.set('category', newCategories[0]);
            } else {
                searchParams.delete('category');
            }
            setSearchParams(searchParams, { replace: true });

            return newCategories;
        });
    };

    const toggleRating = (rating) => {
        setSelectedRatings(prev =>
            prev.includes(rating) ? prev.filter(r => r !== rating) : [...prev, rating]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategories([]);
        setSelectedRatings([]);
        setPriceRange(150000);
        setSearchTerm("");
        searchParams.delete('category');
        setSearchParams(searchParams, { replace: true });
    };

    const activeFilterCount = selectedCategories.length + selectedRatings.length + (priceRange < 150000 ? 1 : 0) + (searchTerm ? 1 : 0);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPrice = product.price <= priceRange;
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesRating = selectedRatings.length === 0 || selectedRatings.some(r => product.rating >= r);
        return matchesSearch && matchesPrice && matchesCategory && matchesRating;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return b.rating - a.rating;
            default: return 0;
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBackground transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <motion.aside
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="lg:w-1/4"
                >
                    <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm sticky top-24 transition-colors duration-300 border border-gray-100 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <SlidersHorizontal size={20} className="text-primary" /> Filters
                                {activeFilterCount > 0 && (
                                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">{activeFilterCount}</span>
                                )}
                            </h2>
                            <button
                                onClick={clearAllFilters}
                                className="text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                            >
                                Clear All
                            </button>
                        </div>

                        {/* Active Filter Tags */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {selectedCategories.map(cat => (
                                    <span key={cat} className="inline-flex items-center gap-1 bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                                        {cat}
                                        <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleCategory(cat)} />
                                    </span>
                                ))}
                                {selectedRatings.map(r => (
                                    <span key={r} className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full dark:bg-yellow-900/30 dark:text-yellow-400">
                                        {r}★+
                                        <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => toggleRating(r)} />
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Price Filter */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Price Range</h3>
                            <input
                                type="range"
                                min="0"
                                max="150000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span>₹0</span>
                                <span className="font-semibold text-primary">₹{Number(priceRange).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <button
                                onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                                className="w-full text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider flex items-center justify-between cursor-pointer hover:text-primary transition-colors"
                            >
                                Category
                                {showCategoryFilter ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <AnimatePresence>
                                {showCategoryFilter && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {categoryConfig.map((cat) => {
                                            const CatIcon = cat.icon;
                                            const isSelected = selectedCategories.includes(cat.name);
                                            return (
                                                <label
                                                    key={cat.name}
                                                    onClick={() => toggleCategory(cat.name)}
                                                    className={`flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-all duration-200 ${isSelected ? 'bg-primary/10 dark:bg-primary/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    <div className="relative flex items-center">
                                                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 dark:border-gray-600'}`}>
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                                </svg>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <CatIcon size={16} className={`${cat.color} transition-colors`} />
                                                    <span className={`text-sm transition-colors ${isSelected ? 'text-primary font-semibold' : 'text-gray-600 dark:text-gray-400 group-hover:text-primary'}`}>
                                                        {cat.name}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <button
                                onClick={() => setShowRatingFilter(!showRatingFilter)}
                                className="w-full text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider flex items-center justify-between cursor-pointer hover:text-primary transition-colors"
                            >
                                Customer Ratings
                                {showRatingFilter ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                            <AnimatePresence>
                                {showRatingFilter && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        {[4, 3, 2, 1].map((rating) => {
                                            const isSelected = selectedRatings.includes(rating);
                                            return (
                                                <label
                                                    key={rating}
                                                    onClick={() => toggleRating(rating)}
                                                    className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200 ${isSelected ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                                >
                                                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center transition-all ${isSelected ? 'bg-yellow-500 border-yellow-500' : 'border-gray-300 dark:border-gray-600'}`}>
                                                        {isSelected && (
                                                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                                <polyline points="20 6 9 17 4 12"></polyline>
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <span key={i} className={`text-xs ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>★</span>
                                                        ))}
                                                    </div>
                                                    <span className={`text-sm ${isSelected ? 'text-yellow-700 dark:text-yellow-400 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>& above</span>
                                                </label>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="lg:w-3/4">
                    {/* Header */}
                    <div className="bg-white dark:bg-darkSurface p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300 border border-gray-100 dark:border-gray-700/50">
                        <div className="flex-1 w-full sm:w-auto relative">
                            <input
                                type="text"
                                placeholder="Search within results..."
                                className="w-full py-2.5 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary/20 focus:outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                            {searchTerm && (
                                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-3">
                                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
                            </span>
                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <span className="hidden sm:inline">Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer text-sm"
                                >
                                    <option value="relevance">Relevance</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Category Quick Pills */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={clearAllFilters}
                            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${selectedCategories.length === 0 ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white dark:bg-darkSurface text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}`}
                        >
                            All
                        </button>
                        {categoryConfig.map((cat) => {
                            const CatIcon = cat.icon;
                            const isActive = selectedCategories.includes(cat.name);
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => {
                                        if (isActive) {
                                            setSelectedCategories([]);
                                            searchParams.delete('category');
                                        } else {
                                            setSelectedCategories([cat.name]);
                                            searchParams.set('category', cat.name);
                                        }
                                        setSearchParams(searchParams, { replace: true });
                                    }}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-white dark:bg-darkSurface text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}`}
                                >
                                    <CatIcon size={14} />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                <span className="text-gray-400 text-sm">Loading products...</span>
                            </div>
                        </div>
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCategories.join(',') + sortBy + searchTerm + priceRange}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                            >
                                {sortedProducts.length > 0 ? (
                                    sortedProducts.map((product, i) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <ProductCard product={product} />
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400">
                                        <div className="flex justify-center mb-4">
                                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                                <Search size={36} className="text-gray-300 dark:text-gray-600" />
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">No products found</h3>
                                        <p className="text-sm mb-4">Try adjusting your filters or search term.</p>
                                        <button
                                            onClick={clearAllFilters}
                                            className="text-primary font-semibold text-sm hover:underline"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    )}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Products;
