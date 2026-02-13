import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-darkSurface rounded-2xl p-4 relative group transition-all duration-300 hover:shadow-xl border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 h-full flex flex-col overflow-hidden"
        >
            {/* Floating Action Buttons */}
            <div className="absolute right-3 top-3 z-10 flex flex-col gap-2 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
                <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={18} />
                </button>
                <button className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-primary hover:text-white text-gray-400 transition-colors delay-75">
                    <ShoppingCart size={18} />
                </button>
            </div>

            {/* Image Container */}
            <Link to={`/product/${product.id}?q=${encodeURIComponent(product.name)}`} className="h-48 sm:h-56 bg-white rounded-xl mb-4 overflow-hidden relative group-hover:bg-gray-50 transition-colors flex items-center justify-center p-4 block">
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />
                {product.discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        -{product.discount}%
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="space-y-2 mt-auto">
                <div className="flex justify-between items-start">
                    <Link to={`/product/${product.id}?q=${encodeURIComponent(product.name)}`} className="block">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer" title={product.name}>
                            {product.name}
                        </h3>
                    </Link>
                </div>

                <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5 bg-yellow-400/20 text-yellow-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {product.rating} <Star size={8} className="fill-current" />
                    </div>
                    <span className="text-gray-400 text-xs">({product.reviews.toLocaleString()} reviews)</span>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-gray-50 dark:border-gray-700 mt-2">
                    <div className="flex flex-col">
                        <span className="text-gray-400 text-xs line-through font-medium">₹{product.originalPrice?.toLocaleString()}</span>
                        <span className="font-bold text-lg text-gray-900 dark:text-white">₹{product.price.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col items-end">
                        {product.platform === 'Flipkart' && <span className="text-[10px] font-medium text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Flipkart</span>}
                        {product.platform === 'Amazon' && <span className="text-[10px] font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded">Amazon</span>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
