import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, Check, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isInCart } = useCart();
    const [showCartFeedback, setShowCartFeedback] = useState(false);
    const inWishlist = isInWishlist(product.id || product.name);
    const inCart = isInCart(product.id || product.name);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setShowCartFeedback(true);
        setTimeout(() => setShowCartFeedback(false), 1500);
    };

    const handleToggleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (inWishlist) {
            removeFromWishlist(product.id || product.name);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="bg-white dark:bg-darkSurface rounded-2xl p-4 relative group transition-all duration-300 hover:shadow-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/20 dark:hover:border-primary/30 h-full flex flex-col overflow-hidden"
        >
            {/* Wishlist Button */}
            <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={handleToggleWishlist}
                className={`absolute right-3 top-3 z-10 p-2.5 rounded-full shadow-lg transition-all duration-300 ${inWishlist
                        ? 'bg-pink-500 text-white shadow-pink-500/30'
                        : 'bg-white/90 dark:bg-gray-700 text-gray-400 hover:text-pink-500 hover:bg-pink-50'
                    }`}
            >
                <Heart size={16} className={inWishlist ? 'fill-white' : ''} />
            </motion.button>

            {/* Image Container */}
            <Link to={`/product/${product.id}?q=${encodeURIComponent(product.name)}`} className="h-48 sm:h-52 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4 overflow-hidden relative group-hover:bg-gray-100/50 dark:group-hover:bg-gray-800 transition-colors flex items-center justify-center p-4 block">
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain mix-blend-multiply"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                />
                {product.discount && (
                    <span className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                        -{product.discount}%
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="space-y-2 mt-auto flex-1 flex flex-col">
                <Link to={`/product/${product.id}?q=${encodeURIComponent(product.name)}`} className="block">
                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm line-clamp-2 leading-tight group-hover:text-primary transition-colors cursor-pointer" title={product.name}>
                        {product.name}
                    </h3>
                </Link>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-md text-[11px] font-bold">
                        {product.rating} <Star size={9} className="fill-current" />
                    </div>
                    <span className="text-gray-400 text-xs">({product.reviews?.toLocaleString()} reviews)</span>
                </div>

                <div className="flex items-end justify-between pt-2 border-t border-gray-50 dark:border-gray-700/50 mt-auto">
                    <div className="flex flex-col">
                        {product.originalPrice && (
                            <span className="text-gray-400 text-xs line-through font-medium">₹{product.originalPrice?.toLocaleString()}</span>
                        )}
                        <span className="font-extrabold text-lg text-gray-900 dark:text-white">₹{product.price?.toLocaleString()}</span>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={handleAddToCart}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${showCartFeedback
                                ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                : inCart
                                    ? 'bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20'
                                    : 'bg-primary text-white hover:bg-indigo-700 shadow-primary/30'
                            }`}
                    >
                        <AnimatePresence mode="wait">
                            {showCartFeedback ? (
                                <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-1">
                                    <Check size={14} /> Added!
                                </motion.span>
                            ) : (
                                <motion.span key="cart" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1">
                                    {inCart ? <><Plus size={14} /> Add More</> : <><ShoppingCart size={14} /> Add to Cart</>}
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductCard;
