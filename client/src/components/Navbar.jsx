import React, { useState, useEffect } from 'react';
import { ShoppingCart, User, Heart, Moon, Sun, LogOut, Home, ChevronDown, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const categories = [
    { name: 'Smartphones', emoji: '📱' },
    { name: 'Laptops', emoji: '💻' },
    { name: 'Audio', emoji: '🎧' },
    { name: 'Watches', emoji: '⌚' },
    { name: 'Gaming', emoji: '🎮' },
    { name: 'Footwear', emoji: '👟' },
];

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const { cartCount, wishlistCount } = useCart();
    const dropdownRef = React.useRef(null);
    const categoryRef = React.useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
            if (categoryRef.current && !categoryRef.current.contains(event.target)) setIsCategoryOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-darkSurface/95 backdrop-blur-xl shadow-lg py-2.5' : 'bg-white/90 dark:bg-darkSurface/90 backdrop-blur-md shadow-sm py-3.5'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 120 }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between gap-6">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 transition-transform group-hover:scale-110 group-hover:rotate-3">
                        S
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        SmartPick
                    </span>
                </Link>

                {/* Nav Links */}
                <div className="hidden md:flex items-center gap-1">
                    <Link to="/" className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        <Home size={16} />
                        Home
                    </Link>

                    {/* Categories Dropdown */}
                    <div className="relative" ref={categoryRef}>
                        <button
                            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                        >
                            <Package size={16} />
                            Categories
                            <ChevronDown size={14} className={`transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isCategoryOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-darkSurface rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden py-2"
                                >
                                    {categories.map((cat) => (
                                        <button
                                            key={cat.name}
                                            onClick={() => {
                                                setIsCategoryOpen(false);
                                                navigate(`/products?category=${cat.name}`);
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-primary/5 hover:text-primary dark:hover:text-primary flex items-center gap-3 transition-colors"
                                        >
                                            <span className="text-lg">{cat.emoji}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Link to="/products" className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                        All Products
                    </Link>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-all hover:scale-105"
                    >
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    </button>

                    {/* Wishlist */}
                    <Link to="/wishlist" className="relative p-2.5 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-900/20 text-gray-500 dark:text-gray-400 hover:text-pink-500 transition-all hover:scale-105 group">
                        <Heart size={20} className="group-hover:fill-pink-500 transition-all" />
                        {wishlistCount > 0 && (
                            <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-darkSurface"
                            >
                                {wishlistCount}
                            </motion.span>
                        )}
                    </Link>

                    {/* Cart */}
                    <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-primary/5 text-gray-500 dark:text-gray-400 hover:text-primary transition-all hover:scale-105 group">
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white dark:border-darkSurface"
                            >
                                {cartCount}
                            </motion.span>
                        )}
                    </Link>

                    {/* Profile / Login */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                    {(user.name || 'U')[0].toUpperCase()}
                                </div>
                                <span className="hidden lg:block text-sm font-semibold text-gray-700 dark:text-gray-200 max-w-[80px] truncate">{user.name}</span>
                            </button>
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-darkSurface rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                        <button onClick={() => { setIsDropdownOpen(false); logout(); }}
                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors">
                                            <LogOut size={16} /> Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:scale-105">
                            <User size={16} />
                            <span className="hidden lg:block">Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
