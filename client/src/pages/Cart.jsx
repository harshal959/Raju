import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Package, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = cartTotal > 999 ? 0 : 99;
    const tax = Math.round(cartTotal * 0.18);
    const grandTotal = cartTotal + shipping + tax;

    return (
        <div className="min-h-screen flex flex-col pt-20 bg-gray-50 dark:bg-darkBackground">
            <Navbar />
            <main className="flex-grow container mx-auto px-6 py-8">
                <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                    <ShoppingBag className="text-primary" /> Your Cart
                    {cart.length > 0 && <span className="text-sm font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">{cart.length} items</span>}
                </motion.h1>

                {cart.length === 0 ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={40} className="text-gray-300 dark:text-gray-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Your cart is empty</h2>
                        <p className="text-gray-400 mb-6">Looks like you haven't added anything yet.</p>
                        <Link to="/products" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-indigo-700 transition-all">
                            Browse Products <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cart.map((item, i) => (
                                    <motion.div
                                        key={item.id || item.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100, height: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white dark:bg-darkSurface rounded-2xl p-5 flex gap-5 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-xl p-2 shrink-0 flex items-center justify-center">
                                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 dark:text-white text-sm truncate">{item.name}</h3>
                                            <p className="text-xs text-gray-400 mt-0.5">{item.category || 'Electronics'}</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
                                                    <button onClick={() => updateQuantity(item.id || item.name, item.quantity - 1)}
                                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="px-4 text-sm font-bold text-gray-800 dark:text-white">{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item.id || item.name, item.quantity + 1)}
                                                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id || item.name)}
                                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="font-extrabold text-gray-900 dark:text-white">₹{(item.price * item.quantity).toLocaleString()}</p>
                                            {item.quantity > 1 && <p className="text-xs text-gray-400 mt-0.5">₹{item.price?.toLocaleString()} each</p>}
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-darkSurface rounded-2xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm h-fit sticky top-24">
                            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white mb-5">Order Summary</h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span><span className="font-semibold">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span className={`font-semibold ${shipping === 0 ? 'text-emerald-500' : ''}`}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Tax (18% GST)</span><span className="font-semibold">₹{tax.toLocaleString()}</span>
                                </div>
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-3 flex justify-between">
                                    <span className="font-extrabold text-gray-900 dark:text-white text-lg">Total</span>
                                    <span className="font-extrabold text-primary text-lg">₹{grandTotal.toLocaleString()}</span>
                                </div>
                            </div>
                            <button className="w-full mt-6 bg-gradient-to-r from-primary to-indigo-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:scale-[1.02] flex items-center justify-center gap-2">
                                Proceed to Checkout <ArrowRight size={18} />
                            </button>
                            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400 justify-center">
                                <ShieldCheck size={14} /> Secure checkout · 100% safe payments
                            </div>
                            {shipping > 0 && (
                                <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-3 py-2 rounded-lg mt-4 text-center font-medium">
                                    Add ₹{(1000 - cartTotal).toLocaleString()} more for free shipping!
                                </p>
                            )}
                        </motion.div>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
};

export default Cart;
