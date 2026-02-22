import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp, Smartphone, Laptop, Headphones, Watch, Gamepad2, Footprints, ShoppingBag, Zap, Gift, Star, ArrowUpRight, BarChart3, Shield, Bell, Clock, CheckCircle, ChevronRight, TrendingDown, Brain, Eye, Users, Search, MousePointer, Flame, Crown, Target } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

const mockProducts = [
    { id: 1, name: "Apple iPhone 13 Pro (128 GB)", image: "https://cdn.dummyjson.com/product-images/smartphones/iphone-13-pro/thumbnail.webp", price: 109999, originalPrice: 129999, discount: 15, rating: 4.8, reviews: 1245, platform: 'Flipkart' },
    { id: 2, name: "Samsung Galaxy S10 Plus", image: "https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s10/thumbnail.webp", price: 49999, originalPrice: 75999, discount: 34, rating: 4.5, reviews: 890, platform: 'Amazon' },
    { id: 3, name: "Apple AirPods Max Silver", image: "https://cdn.dummyjson.com/product-images/mobile-accessories/apple-airpods-max-silver/thumbnail.webp", price: 59990, originalPrice: 65990, discount: 9, rating: 4.6, reviews: 450, platform: 'Flipkart' },
    { id: 4, name: "Nike Air Jordan 1 Red & Black", image: "https://cdn.dummyjson.com/product-images/mens-shoes/nike-air-jordan-1-red-and-black/thumbnail.webp", price: 14999, originalPrice: 18999, discount: 21, rating: 4.7, reviews: 120, platform: 'Amazon' }
];

const features = [
    { icon: TrendingDown, title: 'Smart Price Comparison', desc: 'Compare prices across Amazon, Flipkart, Croma & Meesho in real-time', gradient: 'from-blue-500 to-cyan-500', glow: 'bg-blue-500/20' },
    { icon: Brain, title: 'AI Sentiment Analysis', desc: 'Our AI analyzes thousands of reviews to give you genuine insights', gradient: 'from-purple-500 to-pink-500', glow: 'bg-purple-500/20' },
    { icon: Eye, title: 'Price History Tracking', desc: 'See how prices changed over months so you buy at the perfect time', gradient: 'from-amber-500 to-orange-500', glow: 'bg-amber-500/20' },
    { icon: Bell, title: 'Price Drop Alerts', desc: 'Get notified instantly when your wishlist items hit the lowest price', gradient: 'from-emerald-500 to-teal-500', glow: 'bg-emerald-500/20' },
];

const dealProducts = [
    { name: 'Sony WH-1000XM5', image: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg', price: 29990, was: 34990, save: 5000 },
    { name: 'MacBook Air M2', image: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg', price: 86990, was: 114900, save: 27910 },
    { name: 'PlayStation 5', image: 'https://m.media-amazon.com/images/I/51051FiD9UL._SX679_.jpg', price: 54990, was: 54990, save: 0 },
];

const platforms = [
    { name: 'Amazon', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg', color: '#FF9900' },
    { name: 'Flipkart', logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png', color: '#2874F0' },
    { name: 'Croma', logo: '/logos/croma.svg', color: '#00B5B5' },
    { name: 'Meesho', logo: '/logos/meesho.svg', color: '#F43397' },
];

const categoryCards = [
    { name: 'Smartphones', emoji: '📱', desc: 'Apple, Samsung, OnePlus, Xiaomi & more', count: '20 Products', gradient: 'from-[#4F46E5] to-[#7C3AED]', shadow: 'shadow-indigo-500/30', pattern: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(99,102,241,0.3) 0%, transparent 40%)' },
    { name: 'Laptops', emoji: '💻', desc: 'MacBook Air M2, Dell XPS, HP Spectre', count: '3 Products', gradient: 'from-[#8B5CF6] to-[#D946EF]', shadow: 'shadow-purple-500/30', pattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 90% 20%, rgba(217,70,239,0.3) 0%, transparent 40%)' },
    { name: 'Audio', emoji: '🎧', desc: 'Sony WH-1000XM5, AirPods Pro, JBL', count: '3 Products', gradient: 'from-[#EC4899] to-[#F43F5E]', shadow: 'shadow-pink-500/30', pattern: 'radial-gradient(circle at 90% 90%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 10% 10%, rgba(244,63,94,0.3) 0%, transparent 40%)' },
    { name: 'Watches', emoji: '⌚', desc: 'Apple Watch Ultra, Samsung Watch6', count: '2 Products', gradient: 'from-[#F59E0B] to-[#EF4444]', shadow: 'shadow-orange-500/30', pattern: 'radial-gradient(circle at 10% 30%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(239,68,68,0.3) 0%, transparent 40%)' },
    { name: 'Gaming', emoji: '🎮', desc: 'PlayStation 5, Xbox Series X', count: '2 Products', gradient: 'from-[#10B981] to-[#06B6D4]', shadow: 'shadow-emerald-500/30', pattern: 'radial-gradient(circle at 70% 40%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 30% 90%, rgba(6,182,212,0.3) 0%, transparent 40%)' },
    { name: 'Footwear', emoji: '👟', desc: 'Nike Air Jordan, Adidas Ultraboost', count: '2 Products', gradient: 'from-[#EF4444] to-[#F97316]', shadow: 'shadow-red-500/30', pattern: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(249,115,22,0.3) 0%, transparent 40%)' },
];

// Countdown Timer Component
const CountdownTimer = () => {
    const [time, setTime] = useState({ hours: 7, minutes: 42, seconds: 18 });
    useEffect(() => {
        const timer = setInterval(() => {
            setTime(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
                else { hours = 23; minutes = 59; seconds = 59; }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const TimeBox = ({ value, label }) => (
        <div className="flex flex-col items-center">
            <div className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-mono font-bold text-xl md:text-2xl w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-xl shadow-lg">
                {String(value).padStart(2, '0')}
            </div>
            <span className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">{label}</span>
        </div>
    );

    return (
        <div className="flex gap-2 md:gap-3 items-center">
            <TimeBox value={time.hours} label="HRS" />
            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 -mt-4">:</span>
            <TimeBox value={time.minutes} label="MIN" />
            <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 -mt-4">:</span>
            <TimeBox value={time.seconds} label="SEC" />
        </div>
    );
};

const Home = () => {
    const navigate = useNavigate();

    const handleCategoryClick = (categoryName) => {
        navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <div className="min-h-screen flex flex-col pt-20 bg-background dark:bg-darkBackground transition-colors duration-300">
            <Navbar />

            <main className="flex-grow space-y-20 pb-12">

                {/* ===== HERO SECTION ===== */}
                <section className="container mx-auto px-6 mt-4">
                    <div className="relative rounded-3xl overflow-hidden min-h-[520px] flex items-center justify-center bg-gradient-to-br from-primary via-indigo-600 to-purple-700 shadow-2xl shadow-primary/30">

                        {/* Animated abstract background shapes */}
                        <motion.div animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                        <motion.div animate={{ x: [0, -25, 0], y: [0, 25, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute bottom-10 right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
                        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-white/20 rounded-2xl" />
                        <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute bottom-1/4 left-[20%] w-10 h-10 bg-yellow-300/20 rounded-full" />

                        {/* Dot grid pattern */}
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                            backgroundSize: '30px 30px'
                        }} />

                        {/* Floating product images */}
                        {[
                            { src: 'https://m.media-amazon.com/images/I/71657TiFeHL._SX679_.jpg', pos: 'top-6 left-6 w-20 h-20 md:w-24 md:h-24 -rotate-12' },
                            { src: 'https://m.media-amazon.com/images/I/71f5Eu5lJSL._SX679_.jpg', pos: 'top-4 right-8 w-20 h-20 md:w-28 md:h-28 rotate-6' },
                            { src: 'https://m.media-amazon.com/images/I/51SKmu2G9FL._SX679_.jpg', pos: 'bottom-6 left-10 w-16 h-16 md:w-22 md:h-22 rotate-12' },
                            { src: 'https://m.media-amazon.com/images/I/71CXhVhpM0L._SX679_.jpg', pos: 'bottom-4 right-6 w-20 h-20 md:w-26 md:h-26 -rotate-6' },
                            { src: 'https://m.media-amazon.com/images/I/81P5-189VzL._SX679_.jpg', pos: 'top-1/2 left-3 w-14 h-14 md:w-20 md:h-20 -translate-y-1/2 rotate-[15deg]' },
                            { src: 'https://m.media-amazon.com/images/I/51051FiD9UL._SX679_.jpg', pos: 'top-1/2 right-3 w-14 h-14 md:w-20 md:h-20 -translate-y-1/2 -rotate-[15deg]' },
                        ].map((item, i) => (
                            <motion.div key={i}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 60 }}
                                className={`absolute ${item.pos} hidden md:block z-0`}>
                                <motion.div
                                    animate={{ y: [0, -8, 0], rotate: [0, i % 2 === 0 ? 4 : -4, 0] }}
                                    transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                                    className="bg-white/20 backdrop-blur-md rounded-2xl p-2 border border-white/25 shadow-xl hover:bg-white/30 transition-all cursor-pointer">
                                    <div className="bg-white rounded-xl p-1.5 overflow-hidden">
                                        <img src={item.src} alt="" className="w-full h-full object-contain" />
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}

                        {/* CENTER CONTENT */}
                        <div className="relative z-10 text-center max-w-3xl mx-auto px-4 py-12">
                            <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2 rounded-full inline-flex items-center gap-2 mb-6 border border-white/20 shadow-lg">
                                <Sparkles size={14} /> AI-Powered Price Tracker
                            </motion.span>

                            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-3 leading-tight drop-shadow-lg">
                                What are you <span className="text-yellow-300">looking for?</span>
                            </motion.h1>

                            <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                                className="text-2xl md:text-3xl font-bold text-white/90 mb-3">
                                Find <span className="text-emerald-300">Real Deals</span>. Skip the Fake Ones.
                            </motion.h2>

                            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                                className="text-base md:text-lg text-white/70 mb-8 max-w-xl mx-auto">
                                Track genuine price drops, compare across stores, and shop smarter every day
                            </motion.p>

                            {/* Search bar */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                                className="max-w-xl mx-auto mb-8">
                                <motion.div whileHover={{ scale: 1.02 }} className="flex items-center bg-white rounded-2xl p-2 shadow-2xl shadow-black/20 border border-white/50">
                                    <div className="flex-1 flex items-center gap-3 px-4">
                                        <Search size={20} className="text-gray-400 shrink-0" />
                                        <input
                                            type="text"
                                            placeholder="Search for smartphones, laptops, audio..."
                                            className="w-full py-3 bg-transparent text-gray-700 placeholder-gray-400 text-base outline-none"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    navigate(`/product/search?q=${encodeURIComponent(e.target.value)}`);
                                                }
                                            }}
                                        />
                                    </div>
                                    <button onClick={() => navigate('/products')}
                                        className="bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-xl transition-all text-sm shrink-0 shadow-lg shadow-primary/30">
                                        Search
                                    </button>
                                </motion.div>
                            </motion.div>

                            {/* Platform logos */}
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                                className="flex flex-wrap gap-4 justify-center items-center">
                                {platforms.map((p) => (
                                    <motion.div key={p.name} whileHover={{ scale: 1.15, y: -3 }}
                                        className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20 cursor-pointer hover:bg-white/25 transition-all">
                                        <img src={p.logo} alt={p.name} className="w-5 h-5 object-contain" />
                                        <span className="text-white text-xs font-bold">{p.name}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* ===== WHY SMARTPICK — FEATURE CARDS ===== */}
                <section className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mb-10">
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 text-primary font-bold tracking-wider text-sm uppercase px-5 py-2 rounded-full border border-primary/20 mb-4">
                            <Crown size={14} /> Why SmartPick?
                        </motion.span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">The <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Smartest</span> Way to Shop Online</h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => {
                            const FIcon = f.icon;
                            return (
                                <motion.div key={i}
                                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 80 }}
                                    whileHover={{ y: -8, scale: 1.03 }}
                                    className="relative bg-white dark:bg-darkSurface rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50 group overflow-hidden shadow-lg shadow-gray-200/50 dark:shadow-black/20 hover:shadow-2xl hover:shadow-gray-300/60 dark:hover:shadow-black/40 transition-all duration-500">
                                    <div className={`absolute -top-10 -right-10 w-32 h-32 ${f.glow} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}></div>
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                                        <FIcon size={22} className="text-white" />
                                    </div>
                                    <h3 className="font-bold text-gray-800 dark:text-white text-lg mb-2">{f.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* ===== BROWSE CATEGORIES — Image-based Cards ===== */}
                <section className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                        className="text-center mb-12">
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary font-bold tracking-wider text-sm uppercase px-5 py-2 rounded-full border border-primary/20 mb-4">
                            <Target size={14} /> Browse Categories
                        </motion.span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
                            Browse our <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">curated collections</span>
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">Across every major product category</p>
                    </motion.div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
                        {categoryCards.map((cat, index) => (
                            <motion.div key={cat.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.06, type: 'spring', stiffness: 100 }}
                                whileHover={{ y: -8, scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => handleCategoryClick(cat.name)}
                                className="relative cursor-pointer group rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 p-5 flex flex-col items-center text-center shadow-lg shadow-gray-200/60 dark:shadow-black/20 hover:shadow-2xl hover:shadow-gray-300/70 dark:hover:shadow-black/40 transition-all duration-500 overflow-hidden">

                                {/* Background glow on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-[0.06] transition-opacity duration-500 rounded-2xl`} />

                                {/* Colored emoji circle */}
                                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center mb-3 shadow-lg ${cat.shadow} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                    <motion.span className="text-3xl drop-shadow-md"
                                        whileHover={{ scale: 1.15, rotate: [0, -8, 8, 0] }}
                                        transition={{ duration: 0.3 }}>
                                        {cat.emoji}
                                    </motion.span>
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/30 via-transparent to-transparent" />
                                </div>

                                {/* Category name */}
                                <h3 className="font-extrabold text-sm text-gray-800 dark:text-white mb-1 group-hover:text-primary dark:group-hover:text-primary transition-colors">
                                    {cat.name}
                                </h3>

                                {/* Description */}
                                <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight line-clamp-2">
                                    {cat.desc}
                                </p>

                                {/* Bottom border glow on hover */}
                                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                            </motion.div>
                        ))}
                    </div>

                    {/* Quick link pills */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="flex flex-wrap gap-3 justify-center mt-10">
                        {['🔥 Hot Deals', '⭐ Top Rated', '🆕 New Arrivals', '💰 Under ₹30K', '🏆 Best Sellers'].map((tag) => (
                            <motion.button key={tag}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate('/products')}
                                className="px-5 py-2.5 bg-white dark:bg-darkSurface border border-gray-200 dark:border-gray-700 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary hover:text-primary hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
                                {tag}
                            </motion.button>
                        ))}
                    </motion.div>
                </section>

                {/* ===== DEAL OF THE DAY ===== */}
                <section className="container mx-auto px-6">
                    <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-3xl p-1 shadow-2xl shadow-red-500/30">
                        <div className="bg-white dark:bg-gray-900 rounded-[1.35rem] p-6 md:p-8">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                        <Zap size={24} className="text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">Deal of the Day</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Grab these before they're gone!</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Ends in</span>
                                    <CountdownTimer />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {dealProducts.map((p, i) => (
                                    <motion.div key={i}
                                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                        whileHover={{ y: -4 }}
                                        onClick={() => navigate(`/product/${p.name.toLowerCase().replace(/ /g, '_')}?q=${encodeURIComponent(p.name)}`)}
                                        className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/30 transition-all group">
                                        <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-xl p-2 shrink-0 group-hover:scale-105 transition-transform">
                                            <img src={p.image} alt={p.name} className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-800 dark:text-white text-sm truncate group-hover:text-primary transition-colors">{p.name}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-lg font-extrabold text-gray-900 dark:text-white">₹{p.price.toLocaleString()}</span>
                                                <span className="text-xs text-gray-400 line-through">₹{p.was.toLocaleString()}</span>
                                            </div>
                                            {p.save > 0 && (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full mt-1 inline-block">
                                                    Save ₹{p.save.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ===== TRENDING PRODUCTS ===== */}
                <section className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="text-center mb-10">
                        <motion.span initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 text-orange-600 font-bold tracking-wider text-sm uppercase px-5 py-2 rounded-full border border-orange-200/50 mb-4">
                            <Flame size={14} /> Trending Now
                        </motion.span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">What Everyone's <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Buying</span></h2>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockProducts.map((product) => (
                            <motion.div key={product.id}
                                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* ===== BRAND COMPARISON LOGOS ===== */}
                <section className="container mx-auto px-6">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        className="bg-white dark:bg-darkSurface rounded-3xl border border-gray-100 dark:border-gray-700 p-10 text-center shadow-xl shadow-gray-200/40 dark:shadow-black/30">
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-[0.3em] font-semibold mb-8">We compare prices across</p>
                        <div className="flex items-center gap-10 md:gap-16 flex-wrap justify-center">
                            {platforms.map((p, i) => (
                                <motion.div key={p.name}
                                    initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                    whileHover={{ scale: 1.2, y: -5 }}
                                    className="flex flex-col items-center gap-3 group cursor-pointer">
                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 group-hover:border-primary/30">
                                        <img src={p.logo} alt={p.name} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">{p.name}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* ===== AI POWERED SECTION ===== */}
                <section className="container mx-auto px-6">
                    <div className="bg-gradient-to-br from-primary via-indigo-600 to-purple-700 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/15 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
                        <div className="relative z-10 text-center max-w-2xl mx-auto">
                            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                                <Brain size={40} className="mx-auto mb-4 text-white/80" />
                                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">AI-Powered Shopping Intelligence</h2>
                                <p className="text-white/70 mb-8 max-w-lg mx-auto">Our AI analyzes millions of data points to find the best deals, predict price drops, and give you genuine review insights.</p>
                                <div className="flex flex-wrap gap-4 justify-center">
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/products')}
                                        className="bg-white text-primary font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                                        <ShoppingBag size={18} /> Start Shopping
                                    </motion.button>
                                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                        onClick={() => navigate('/products')}
                                        className="bg-white/15 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-xl border border-white/20 hover:bg-white/25 transition-all flex items-center gap-2">
                                        Explore Deals <ArrowRight size={18} />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>
                        {/* AI Preview cards */}
                        <div className="flex justify-center gap-4 mt-10 overflow-hidden">
                            {mockProducts.slice(0, 2).map((product) => (
                                <div key={`ai-${product.id}`} className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                    <img src={product.image} alt={product.name} className="w-full h-24 object-contain mb-2" />
                                    <p className="text-xs truncate font-medium">{product.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
