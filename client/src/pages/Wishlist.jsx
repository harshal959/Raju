import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Wishlist = () => {
    const { wishlist, removeFromWishlist, moveToCart } = useCart();

    return (
        <div className="min-h-screen flex flex-col pt-20 bg-gray-50 dark:bg-darkBackground">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-8">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <Heart className="text-pink-500 fill-pink-500" /> Your Wishlist
                    {wishlist.length > 0 && <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{wishlist.length} items</span>}
                </motion.h1>

                {wishlist.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20">
                        <div className="w-24 h-24 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart size={40} className="text-pink-300 dark:text-pink-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-400 mb-6">Save items you love for later.</p>
                        <Link to="/products" className="inline-flex items-center gap-2 bg-pink-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-pink-500/30 hover:bg-pink-600 transition-all">
                            Explore Products <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AnimatePresence>
                            {wishlist.map((item, i) => (
                                <motion.div
                                    key={item.id || item.name}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white dark:bg-darkSurface rounded-2xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all group"
                                >
                                    <Link to={`/product/${item.id}?q=${encodeURIComponent(item.name)}`}
                                        className="block h-40 bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden flex items-center justify-center p-4 mb-4 group-hover:bg-gray-100/50 transition-colors">
                                        <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform" />
                                    </Link>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-sm truncate mb-1">{item.name}</h3>
                                    <p className="font-extrabold text-primary text-lg">₹{item.price?.toLocaleString()}</p>
                                    <div className="flex gap-2 mt-4">
                                        <button
                                            onClick={() => moveToCart(item)}
                                            className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-primary/20"
                                        >
                                            <ShoppingCart size={14} /> Move to Cart
                                        </button>
                                        <button
                                            onClick={() => removeFromWishlist(item.id || item.name)}
                                            className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border border-gray-100 dark:border-gray-700"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Wishlist;
