import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, ChevronDown, Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

// Reuse mock data for now
const mockProducts = [
    {
        id: 1,
        name: "Apple iPhone 13 Pro (128 GB)",
        image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp",
        price: 109999,
        originalPrice: 129999,
        discount: 15,
        rating: 4.8,
        reviews: 1245,
        platform: 'Flipkart'
    },
    {
        id: 2,
        name: "Samsung Galaxy S10 Plus",
        image: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp",
        price: 49999,
        originalPrice: 75999,
        discount: 34,
        rating: 4.5,
        reviews: 890,
        platform: 'Amazon'
    },
    {
        id: 3,
        name: "Apple AirPods Max Silver",
        image: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp",
        price: 59990,
        originalPrice: 65990,
        discount: 9,
        rating: 4.6,
        reviews: 450,
        platform: 'Flipkart'
    },
    {
        id: 4,
        name: "Nike Air Jordan 1 Red & Black",
        image: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp",
        price: 14999,
        originalPrice: 18999,
        discount: 21,
        rating: 4.7,
        reviews: 120,
        platform: 'Amazon'
    },
    {
        id: 5,
        name: "Puma Men Running Shoes",
        image: "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp",
        price: 2499,
        originalPrice: 5999,
        discount: 58,
        rating: 4.2,
        reviews: 1200,
        platform: 'Amazon'
    },
    {
        id: 6,
        name: "Sony WH-1000XM5 Wireless Headphones",
        image: "https://rukminim2.flixcart.com/image/612/612/xif0q/headphone/l/w/c/-original-imagg5a3m6hr7z5b.jpeg?q=70", // Fallback if needed or use dummyjson
        price: 26990,
        originalPrice: 34990,
        discount: 22,
        rating: 4.4,
        reviews: 4500,
        platform: 'Flipkart'
    }
];

const Products = () => {
    const [priceRange, setPriceRange] = useState(150000);
    const [selectedCategories, setSelectedCategories] = useState([]);

    const categories = ['Smartphones', 'Headphones', 'Laptops', 'Footwear', 'Watches'];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-darkBg transition-colors duration-300">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12 flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <motion.aside
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="lg:w-1/4"
                >
                    <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm sticky top-24 transition-colors duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Filter size={20} /> Filters
                            </h2>
                            <button className="text-sm text-primary font-semibold hover:underline">Clear All</button>
                        </div>

                        {/* Price Filter */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Price Range</h3>
                            <input
                                type="range"
                                min="0"
                                max="150000"
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
                                <span>₹0</span>
                                <span>₹{priceRange}</span>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider flex items-center justify-between cursor-pointer">
                                Category <ChevronDown size={16} />
                            </h3>
                            <div className="space-y-3">
                                {categories.map((category) => (
                                    <label key={category} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input type="checkbox" className="peer w-4 h-4 border-2 border-gray-300 rounded checked:bg-primary checked:border-primary transition-colors appearance-none" />
                                            <svg className="absolute w-4 h-4 text-white hidden peer-checked:block pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors">{category}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div>
                            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-4 uppercase tracking-wider">Customer Ratings</h3>
                            <div className="space-y-2">
                                {[4, 3, 2, 1].map((rating) => (
                                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary" />
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">{rating}★ & above</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.aside>

                {/* Main Content */}
                <main className="lg:w-3/4">
                    {/* Header */}
                    <div className="bg-white dark:bg-darkSurface p-4 rounded-xl shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors duration-300">
                        <div className="flex-1 w-full sm:w-auto relative">
                            <input type="text" placeholder="Search within results..." className="w-full py-2.5 pl-10 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary/20" />
                            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="hidden sm:inline">Sort By:</span>
                            <select className="bg-transparent font-bold text-gray-900 dark:text-white border-none focus:ring-0 cursor-pointer">
                                <option>Relevance</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                                <option>Newest First</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="mt-12 flex justify-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-bold shadow-lg shadow-primary/30">1</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-darkSurface text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">2</button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-darkSurface text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">3</button>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Products;
