import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, Heart, Moon, Sun, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAuth();
    const dropdownRef = React.useRef(null);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            // Navigate to product details with search query
            navigate(`/product/search?q=${encodeURIComponent(searchTerm)}`);
            setSearchTerm('');
        }
    };


    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
    };

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white dark:bg-darkSurface shadow-md py-3' : 'bg-white/90 dark:bg-darkSurface/90 backdrop-blur-md shadow-sm py-4'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
        >
            <div className="container mx-auto px-6 flex items-center justify-between gap-8">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 transition-transform group-hover:scale-110">
                        S
                    </div>
                    <span className={`text-2xl font-bold tracking-tight ${scrolled ? 'text-gray-900 dark:text-white' : 'text-gray-900 dark:text-white'} group-hover:text-primary transition-colors`}>
                        SmartPick
                    </span>
                </Link>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-2xl relative group">
                    <input
                        type="text"
                        placeholder="Search for anything..."
                        className={`w-full py-2.5 px-6 pr-12 text-sm text-gray-800 dark:text-gray-100 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all rounded-full outline-none shadow-sm group-hover:shadow-md`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-white rounded-full hover:bg-primaryDark transition-colors shadow-sm">
                        <Search size={16} />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex items-center space-x-6">
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary font-bold transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={18} className="stroke-[2.5px]" />
                                </div>
                                <span className="hidden lg:block max-w-[100px] truncate">{user.name || 'User'}</span>
                            </button>

                            {/* Dropdown */}
                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-darkSurface rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 transition-colors"
                                        >
                                            <LogOut size={16} />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary font-bold transition-colors">
                            <User size={20} className="stroke-[2.5px]" />
                            <span className="hidden lg:block">Sign In</span>
                        </Link>
                    )}

                    <Link to="/wishlist" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-secondary transition-colors relative group font-bold">
                        <div className="relative">
                            <Heart size={20} className="group-hover:fill-secondary stroke-[2.5px]" />
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-secondary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">2</span>
                        </div>
                        <span className="hidden lg:block">Wishlist</span>
                    </Link>

                    <Link to="/cart" className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-primary transition-colors relative font-bold">
                        <div className="relative">
                            <ShoppingCart size={20} className="stroke-[2.5px]" />
                            <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
                        </div>
                        <span className="hidden lg:block">Cart</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Search - Only visible on small screens */}
            <div className="md:hidden px-4 pb-3 mt-2">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full py-2 px-4 pr-10 text-sm bg-gray-100 dark:bg-gray-800 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-gray-800 dark:text-gray-100"
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
