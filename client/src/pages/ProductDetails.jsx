import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Truck, RotateCcw, TrendingUp, Sparkles, ExternalLink, ArrowLeft, Tag, CreditCard, Percent, Gift, Clock, BadgePercent, Wallet, Shield, Zap, ChevronRight, CheckCircle, ShoppingCart, Heart, Package } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { mockProductDetails } from '../data/mockProductDetails';
import { useCart } from '../context/CartContext';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

import axios from 'axios';
// ... existing imports

const ProductDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const queryParam = searchParams.get('q');

    // State for product data
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState("");
    const [activeReviewTab, setActiveReviewTab] = useState('amazon');
    const [selectedEmi, setSelectedEmi] = useState(null);
    const [appliedOffers, setAppliedOffers] = useState({});
    const [copiedCode, setCopiedCode] = useState(null);
    const [showCartFeedback, setShowCartFeedback] = useState(false);

    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, isInCart } = useCart();

    // Dynamic Festival Sale based on current month
    const getFestivalSale = () => {
        const month = new Date().getMonth(); // 0-11
        const festivals = {
            0: { name: "🇮🇳 Republic Day Sale", emoji: "🏳️", gradient: "from-orange-500 via-amber-300 to-green-600", coupon: "REPUBLIC26", extra: 5, end: "Jan 31", exchange: "Up to ₹15,000 off on exchange", desc: "Celebrate India's Republic Day! Lohri & Pongal Special Offers" },
            1: { name: "🕉️ Maha Shivratri Sale", emoji: "🔱", gradient: "from-blue-600 via-indigo-500 to-purple-700", coupon: "SHIVRATRI26", extra: 4, end: "Feb 28", exchange: "Up to ₹19,000 off on exchange", desc: "Maha Shivratri & Basant Panchami Festival Deals" },
            2: { name: "🎨 Holi Dhamaka Sale", emoji: "🌈", gradient: "from-pink-500 via-yellow-400 to-green-500", coupon: "HOLI2026", extra: 7, end: "Mar 25", exchange: "Up to ₹18,000 off on exchange", desc: "Splash of Colors, Splash of Savings! Holi Special" },
            3: { name: "🌾 Baisakhi & Ugadi Sale", emoji: "🌸", gradient: "from-yellow-500 via-orange-400 to-amber-600", coupon: "BAISAKHI26", extra: 5, end: "Apr 20", exchange: "Up to ₹13,000 off on exchange", desc: "New Year Celebrations - Baisakhi, Ugadi, Vishu Offers" },
            4: { name: "✨ Akshaya Tritiya Sale", emoji: "🪙", gradient: "from-amber-400 via-yellow-500 to-orange-500", coupon: "AKSHAYA26", extra: 6, end: "May 15", exchange: "Up to ₹16,000 off on exchange", desc: "Akshaya Tritiya & Buddha Purnima Auspicious Deals" },
            5: { name: "🛕 Rath Yatra Sale", emoji: "🙏", gradient: "from-orange-500 via-red-500 to-yellow-500", coupon: "RATH2026", extra: 5, end: "Jun 30", exchange: "Up to ₹14,000 off on exchange", desc: "Rath Yatra & Eid ul-Adha Festival Bonanza" },
            6: { name: "🌧️ Sawan Sale", emoji: "🕉️", gradient: "from-teal-500 via-cyan-500 to-blue-600", coupon: "SAWAN2026", extra: 4, end: "Jul 31", exchange: "Up to ₹12,000 off on exchange", desc: "Sacred Sawan Month & Guru Purnima Offers" },
            7: { name: "🇮🇳 Independence Day Sale", emoji: "🏳️", gradient: "from-orange-500 via-amber-200 to-green-600", coupon: "AZADI2026", extra: 8, end: "Aug 20", exchange: "Up to ₹20,000 off on exchange", desc: "Azadi Ka Amrit Mahotsav! Raksha Bandhan & Janmashtami Deals" },
            8: { name: "🐘 Ganesh Chaturthi Sale", emoji: "🪷", gradient: "from-orange-500 via-red-500 to-pink-600", coupon: "GANESH2026", extra: 6, end: "Sep 20", exchange: "Up to ₹17,000 off on exchange", desc: "Ganpati Bappa Morya! Onam & Ganesh Chaturthi Offers" },
            9: { name: "🏹 Navratri & Dussehra Sale", emoji: "⚔️", gradient: "from-red-600 via-orange-500 to-yellow-500", coupon: "NAVRATRI26", extra: 9, end: "Oct 25", exchange: "Up to ₹22,000 off on exchange", desc: "Victory of Good Over Evil! Navratri, Durga Puja & Dussehra Specials" },
            10: { name: "🪔 Diwali Dhamaka Sale", emoji: "✨", gradient: "from-amber-500 via-orange-500 to-red-600", coupon: "DIWALI2026", extra: 10, end: "Nov 15", exchange: "Up to ₹25,000 off on exchange", desc: "Festival of Lights! Diwali, Dhanteras & Bhai Dooj Mega Offers" },
            11: { name: "🎄 Christmas & Guru Purab Sale", emoji: "🎅", gradient: "from-red-500 via-green-600 to-emerald-500", coupon: "XMAS2026", extra: 6, end: "Dec 31", exchange: "Up to ₹20,000 off on exchange", desc: "Christmas, Guru Nanak Jayanti & New Year Countdown Deals" },
        };
        return festivals[month];
    };

    const currentSale = getFestivalSale();

    const toggleOffer = (index) => {
        setAppliedOffers(prev => ({ ...prev, [index]: !prev[index] }));
    };

    const copyCode = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // Use the search query from URL, or fallback to the ID (formatted) or default
                let query = queryParam;
                if (!query && id && id !== 'search') {
                    query = id.replace(/_/g, " ");
                }
                if (!query) {
                    query = "Apple iPhone 15 Pro (128 GB) - Natural Titanium";
                }

                // Fetch from Python Service
                const response = await axios.get(`http://localhost:5001/scrape?query=${encodeURIComponent(query)}`);

                // Merge scraped data with static details (images, highlights) that might not be scraped easily
                // or just use mock structure if scraping returns failure.

                const scrapedData = response.data;

                // Combine with base mock data for static fields (images, highlights) 
                // because our simple scraper doesn't get images/highlights yet.
                const baseData = mockProductDetails;

                // Helper to generate fallback price comparison if missing
                const generateFallbackPrices = (basePrice) => {
                    return [
                        { store: "Amazon", price: basePrice, logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", link: "https://amazon.in", best: true },
                        { store: "Flipkart", price: Math.round(basePrice * 1.02), logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png", link: "https://flipkart.com", best: false },
                        { store: "Croma", price: Math.round(basePrice * 1.05), logo: "/logos/croma.svg", link: "https://croma.com", best: false },
                        { store: "Meesho", price: Math.round(basePrice * 1.08), logo: "/logos/meesho.svg", link: "https://meesho.com", best: false }
                    ];
                };

                const currentPrice = scrapedData.price || 0;
                const comparisonData = scrapedData.price_comparison && scrapedData.price_comparison.length > 0
                    ? scrapedData.price_comparison
                    : generateFallbackPrices(currentPrice > 0 ? currentPrice : 99999);

                const finalProduct = {
                    ...baseData, // Keep baseData only for structure safe-keeping
                    name: scrapedData.name || (queryParam ? query : baseData.name),
                    image: scrapedData.image || "https://placehold.co/400x400?text=No+Image",
                    rating: scrapedData.rating || 0,
                    reviews_count: scrapedData.reviews_count || 0,
                    price: currentPrice, // Ensure top-level price is set
                    original_price: scrapedData.original_price || Math.round(currentPrice * 1.2),

                    // Only use baseData gallery if we are indeed looking at the iPhone (default), otherwise empty
                    gallery: queryParam ? [scrapedData.image || "https://placehold.co/400x400?text=No+Image"] : baseData.gallery,
                    highlights: queryParam ? [] : baseData.highlights, // Clear highlights for custom search

                    price_comparison: comparisonData,
                    ai_recommendation: scrapedData.ai_recommendation || { store: "Amazon", reason: "Best price availability.", score: 9.0 },
                    price_history: scrapedData.price_history && scrapedData.price_history.labels && scrapedData.price_history.labels.length > 0 ? scrapedData.price_history : baseData.price_history,
                    ai_reviews: scrapedData.ai_reviews || baseData.ai_reviews // Use API reviews or fallback to mock
                };

                setProduct(finalProduct);
                setSelectedImage(finalProduct.image);

            } catch (err) {
                console.error("Failed to fetch product data:", err);
                setError("Failed to load live data.");

                // Fallback: Create a placeholder product based on the query
                // instead of showing the hardcoded iPhone mock data.
                const query = queryParam || "Product Details";
                setProduct({
                    ...mockProductDetails,
                    name: query,
                    price_comparison: [
                        { store: "Amazon", price: 99999, logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", link: "#", best: true },
                        { store: "Flipkart", price: 102000, logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png", link: "#", best: false },
                        { store: "Croma", price: 104999, logo: "/logos/croma.svg", link: "#", best: false },
                        { store: "Meesho", price: 107999, logo: "/logos/meesho.svg", link: "#", best: false }
                    ],
                    ai_recommendation: { store: "Amazon", reason: "Could not fetch live data. Showing estimated values.", score: 8.5 },
                });
                setSelectedImage(mockProductDetails.image);
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, queryParam]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-darkBackground">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) return <div>Product not found</div>;

    const chartData = {
        labels: product.price_history.labels,
        datasets: product.price_history.datasets.map(ds => ({
            ...ds,
            borderColor: ds.borderColor || '#4f46e5',
            backgroundColor: ds.backgroundColor || 'rgba(79, 70, 229, 0.08)',
            fill: true,
            borderWidth: ds.borderWidth || 2.5,
            pointRadius: ds.pointRadius || 4,
            pointHoverRadius: ds.pointHoverRadius || 7,
            pointBackgroundColor: ds.pointBackgroundColor || ds.borderColor || '#4f46e5',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3,
        }))
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: { size: 12, weight: 'bold', family: "'Inter', sans-serif" },
                    color: '#6B7280',
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                titleColor: '#F9FAFB',
                bodyColor: '#D1D5DB',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 14,
                cornerRadius: 12,
                titleFont: { size: 13, weight: 'bold' },
                bodyFont: { size: 12 },
                bodySpacing: 6,
                callbacks: {
                    title: (items) => `📅 ${items[0].label}`,
                    label: (item) => `  ${item.dataset.label}: ₹${item.raw.toLocaleString('en-IN')}`,
                    afterBody: (items) => {
                        const prices = items.map(i => i.raw);
                        const lowest = Math.min(...prices);
                        const lowestStore = items.find(i => i.raw === lowest)?.dataset.label;
                        return `\n🏆 Lowest: ${lowestStore} (₹${lowest.toLocaleString('en-IN')})`;
                    }
                }
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.04)',
                    drawBorder: false,
                },
                ticks: {
                    callback: (value) => `₹${(value / 1000).toFixed(0)}K`,
                    font: { size: 11, weight: '600' },
                    color: '#9CA3AF',
                    padding: 8,
                },
                border: { display: false }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false,
                },
                ticks: {
                    font: { size: 11, weight: '500' },
                    color: '#9CA3AF',
                    padding: 6,
                },
                border: { display: false }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        },
        elements: {
            line: { borderJoinStyle: 'round' }
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-darkBackground transition-colors duration-300 font-sans">
            <Navbar />

            <main className="container mx-auto px-4 py-8 pt-24">
                {/* Breadcrumb / Back */}
                <Link to="/" className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors">
                    <ArrowLeft size={18} className="mr-2" /> Back to Search
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Images & Info */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white dark:bg-white/5 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-center h-64 sm:h-80 w-full max-w-sm mx-auto relative overflow-hidden group"
                        >
                            <img src={selectedImage} alt={product.name} className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-110" />
                        </motion.div>
                        <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                            {product.gallery.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(img)}
                                    className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 p-1.5 bg-white dark:bg-white/5 ${selectedImage === img ? 'border-primary' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                                >
                                    <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>

                        {/* Highlights (Moved to Left) */}
                        <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-3">Highlights</h3>
                            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 list-disc list-inside">
                                {product.highlights.map((highlight, idx) => (
                                    <li key={idx}>{highlight}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Bank & Card Offers - Interactive */}
                        <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 border-b border-blue-100 dark:border-blue-800/30">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <CreditCard size={20} className="text-blue-600" /> Bank & Card Offers
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">Apply offers at checkout for extra savings</p>
                            </div>
                            <div className="p-4 space-y-2.5">
                                {(product.bank_offers || product.offers || []).slice(0, 6).map((offer, i) => (
                                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${appliedOffers[i] ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 shadow-md shadow-green-100 dark:shadow-green-900/20' : 'border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/30'}`}
                                        onClick={() => toggleOffer(i)}>
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-sm"
                                            style={{ backgroundColor: `${(offer.color || '#4F46E5')}15`, border: `1px solid ${(offer.color || '#4F46E5')}30` }}>
                                            {offer.icon || '💳'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{offer.bank || offer.store}</span>
                                                {offer.type && <span className="text-[9px] font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{offer.type}</span>}
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{offer.discount || offer.description}</p>
                                            {offer.code && offer.code !== 'Auto-applied' && (
                                                <button onClick={(e) => { e.stopPropagation(); copyCode(offer.code); }}
                                                    className="inline-block mt-1 text-[10px] font-mono font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-0.5 rounded border border-dashed border-green-300 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-800/30 cursor-pointer transition-colors">
                                                    {copiedCode === offer.code ? '✓ Copied!' : `📋 ${offer.code}`}
                                                </button>
                                            )}
                                        </div>
                                        <button onClick={(e) => { e.stopPropagation(); toggleOffer(i); }}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${appliedOffers[i]
                                                ? 'bg-green-600 text-white shadow-md'
                                                : 'bg-primary/10 text-primary hover:bg-primary hover:text-white'
                                                }`}>
                                            {appliedOffers[i] ? '✓ Applied' : 'Apply'}
                                        </button>
                                    </motion.div>
                                ))}
                                {Object.values(appliedOffers).some(v => v) && (
                                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800/30 text-center">
                                        <p className="text-xs font-bold text-green-700 dark:text-green-300">
                                            🎉 {Object.values(appliedOffers).filter(v => v).length} offer(s) applied · Savings will reflect at checkout
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* EMI Plans - Interactive */}
                        {product.emi_plans && (
                            <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 border-b border-purple-100 dark:border-purple-800/30">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Wallet size={20} className="text-purple-600" /> EMI Plans
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">No Cost & Low Interest EMI available</p>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-3 gap-2.5">
                                        {product.emi_plans.map((emi, i) => (
                                            <motion.div key={i} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                                                onClick={() => setSelectedEmi(i === selectedEmi ? null : i)}
                                                className={`relative rounded-xl border-2 p-3 text-center cursor-pointer transition-all ${selectedEmi === i
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-200 dark:shadow-purple-900/30'
                                                    : 'border-gray-100 dark:border-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-md'
                                                    }`}>
                                                {emi.interest === 'No Cost EMI' && (
                                                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[8px] font-bold bg-green-500 text-white px-2 py-0.5 rounded-full shadow-sm">NO COST</span>
                                                )}
                                                {selectedEmi === i && (
                                                    <CheckCircle size={14} className="absolute top-1.5 right-1.5 text-purple-600" />
                                                )}
                                                <p className="text-xl font-extrabold text-gray-900 dark:text-white mt-1">{emi.months}</p>
                                                <p className="text-[9px] text-gray-400 uppercase font-semibold tracking-wider">months</p>
                                                <p className="text-sm font-bold text-primary mt-1.5">₹{emi.monthly.toLocaleString()}<span className="text-[9px] text-gray-400">/mo</span></p>
                                                <p className="text-[9px] text-gray-400 mt-1">{emi.banks?.slice(0, 2).join(', ')}{emi.banks?.length > 2 ? ` +${emi.banks.length - 2}` : ''}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                    {selectedEmi !== null && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800/30">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-800 dark:text-white">{product.emi_plans[selectedEmi].months} Month EMI Plan</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{product.emi_plans[selectedEmi].interest} · {product.emi_plans[selectedEmi].banks?.join(', ')}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-extrabold text-primary">₹{product.emi_plans[selectedEmi].monthly.toLocaleString()}<span className="text-xs text-gray-400">/mo</span></p>
                                                    <p className="text-[10px] text-gray-400">Total: ₹{(product.emi_plans[selectedEmi].monthly * product.emi_plans[selectedEmi].months).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Protection Plans */}
                        {product.protection_plans && (
                            <div className="space-y-3">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Shield size={20} className="text-emerald-600" /> Protection Plans
                                </h3>
                                {product.protection_plans.map((plan, i) => (
                                    <div key={i} className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/10 dark:to-teal-900/10 rounded-xl p-4 border border-emerald-100 dark:border-emerald-800/30">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h4 className="font-bold text-sm text-gray-800 dark:text-white">{plan.name}</h4>
                                                <span className="text-xs text-gray-500">{plan.duration}</span>
                                            </div>
                                            <span className="font-extrabold text-emerald-600">₹{plan.price.toLocaleString()}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 mt-2">
                                            {plan.covers.map((c, j) => (
                                                <span key={j} className="text-[10px] bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700 flex items-center gap-1">
                                                    <CheckCircle size={8} className="text-emerald-500" /> {c}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-6">
                        {/* Dynamic Festival Sale Banner */}
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className={`bg-gradient-to-r ${currentSale.gradient} rounded-2xl p-4 text-white relative overflow-hidden shadow-xl`}>
                            <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/10 rounded-full blur-xl" />
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full blur-lg" />
                            <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                                        {currentSale.emoji}
                                    </div>
                                    <div>
                                        <h3 className="font-extrabold text-base drop-shadow-sm">{currentSale.name}</h3>
                                        <p className="text-white/90 text-xs mt-0.5">Extra {currentSale.extra}% off · Code: <button onClick={() => copyCode(currentSale.coupon)} className="font-mono font-bold bg-white/25 hover:bg-white/40 px-2 py-0.5 rounded cursor-pointer transition-colors">{copiedCode === currentSale.coupon ? '✓ Copied!' : currentSale.coupon}</button></p>
                                        {currentSale.desc && <p className="text-white/70 text-[10px] mt-1 drop-shadow-sm">{currentSale.desc}</p>}
                                    </div>
                                </div>
                                <div className="text-right bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2">
                                    <span className="text-[9px] text-white/70 block uppercase tracking-wider">Ends</span>
                                    <span className="font-extrabold text-sm">{currentSale.end}</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Product Name + Price */}
                        <div>
                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center bg-green-600 text-white px-2.5 py-1 rounded-lg text-sm font-bold gap-1">
                                    {product.rating} <Star size={12} className="fill-white" />
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{product.reviews_count.toLocaleString()} Reviews</span>
                                <span className="text-green-600 text-sm font-medium flex items-center gap-1"><CheckCircle size={14} /> In Stock</span>
                            </div>

                            {/* Price Section with Discount */}
                            <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{(product.price || 127999).toLocaleString()}</span>
                                    {product.original_price && (
                                        <span className="text-lg text-gray-400 line-through">₹{product.original_price.toLocaleString()}</span>
                                    )}
                                    {product.discount && (
                                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-lg text-sm font-extrabold flex items-center gap-1">
                                            <BadgePercent size={14} /> {product.discount}% OFF
                                        </span>
                                    )}
                                </div>
                                {product.original_price && (
                                    <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1">
                                        <Gift size={14} /> You save ₹{(product.original_price - (product.price || 127999)).toLocaleString()} on this purchase
                                    </p>
                                )}
                                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                                    <RotateCcw size={12} /> {currentSale.exchange}
                                </p>
                                {/* Festival extra discount info */}
                                <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-3 flex items-center gap-2">
                                    <Zap size={16} className="text-amber-600 shrink-0" />
                                    <p className="text-xs text-amber-800 dark:text-amber-200">
                                        <span className="font-bold">Festival Bonus:</span> Extra {currentSale.extra}% off with code <span className="font-mono font-bold">{currentSale.coupon}</span> = <span className="font-extrabold text-green-700 dark:text-green-300">₹{Math.round((product.price || 127999) * currentSale.extra / 100).toLocaleString()} saved</span>
                                    </p>
                                </div>
                            </div>

                            {/* Add to Cart & Wishlist Buttons */}
                            <div className="flex gap-3 mt-1">
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => {
                                        addToCart({
                                            id: product.id || id,
                                            name: product.name,
                                            price: product.price || 127999,
                                            image: product.image,
                                            category: 'Electronics'
                                        });
                                        setShowCartFeedback(true);
                                        setTimeout(() => setShowCartFeedback(false), 2000);
                                    }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all shadow-lg ${showCartFeedback
                                        ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                                        : isInCart(product.id || id || product.name)
                                            ? 'bg-primary/10 text-primary border-2 border-primary/30 hover:bg-primary hover:text-white'
                                            : 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-[1.02]'
                                        }`}
                                >
                                    <AnimatePresence mode="wait">
                                        {showCartFeedback ? (
                                            <motion.span key="added" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="flex items-center gap-2">
                                                <CheckCircle size={20} /> Added to Cart!
                                            </motion.span>
                                        ) : isInCart(product.id || id || product.name) ? (
                                            <motion.span key="addmore" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                                <ShoppingCart size={20} /> Add More
                                            </motion.span>
                                        ) : (
                                            <motion.span key="add" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2">
                                                <ShoppingCart size={20} /> Add to Cart
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                <motion.button
                                    whileTap={{ scale: 0.85 }}
                                    onClick={() => {
                                        const productData = {
                                            id: product.id || id,
                                            name: product.name,
                                            price: product.price || 127999,
                                            image: product.image
                                        };
                                        if (isInWishlist(product.id || id || product.name)) {
                                            removeFromWishlist(product.id || id || product.name);
                                        } else {
                                            addToWishlist(productData);
                                        }
                                    }}
                                    className={`p-4 rounded-2xl border-2 transition-all shadow-md ${isInWishlist(product.id || id || product.name)
                                        ? 'bg-pink-500 border-pink-500 text-white shadow-pink-500/30'
                                        : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-pink-300 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20'
                                        }`}
                                >
                                    <Heart size={22} className={isInWishlist(product.id || id || product.name) ? 'fill-white' : ''} />
                                </motion.button>
                            </div>

                            {/* Delivery & Trust Badges */}
                            <div className="grid grid-cols-3 gap-3">
                                <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <Truck size={18} className="text-blue-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Free Delivery</span>
                                    <span className="text-[9px] text-gray-400">2-4 days</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <RotateCcw size={18} className="text-green-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">7-Day Return</span>
                                    <span className="text-[9px] text-gray-400">Easy returns</span>
                                </div>
                                <div className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                    <ShieldCheck size={18} className="text-purple-500 mb-1" />
                                    <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">Warranty</span>
                                    <span className="text-[9px] text-gray-400">1 year</span>
                                </div>
                            </div>
                        </div>

                        {/* Price Comparison Card */}
                        <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Tag size={18} className="text-primary" /> Price Comparison
                                </h3>
                                <span className="text-xs text-gray-500">Updated: Just now</span>
                            </div>
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {product.price_comparison.map((item, index) => (
                                    <div key={index} className={`p-4 flex items-center justify-between ${item.best ? 'bg-green-50/50 dark:bg-green-900/10' : ''}`}>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl p-1.5 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center justify-center shrink-0">
                                                <img src={item.logo} alt={item.store} className="w-full h-full object-contain" />
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">{item.store}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-lg font-bold text-gray-900 dark:text-white">₹{item.price.toLocaleString()}</div>
                                            {item.best && <div className="text-xs text-green-600 font-bold">Best Price</div>}
                                        </div>
                                        <a
                                            href={item.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-4 bg-primary hover:bg-primaryDark text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1"
                                        >
                                            Buy <ExternalLink size={14} />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* AI Review Summary (Platform Specific) */}
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-800/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={100} />
                            </div>
                            <h3 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 flex items-center gap-2">
                                <Sparkles className="text-indigo-600 dark:text-indigo-400" size={20} /> AI Review Summary
                            </h3>

                            {/* Platform Tabs */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
                                {Object.keys(product.ai_reviews).map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() => setActiveReviewTab(platform)}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${activeReviewTab === platform ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-white/10 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30'}`}
                                    >
                                        {platform}
                                    </button>
                                ))}
                            </div>

                            {/* Active Tab Content */}
                            {product.ai_reviews[activeReviewTab] && (
                                <motion.div
                                    key={activeReviewTab}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <p className="text-sm text-gray-700 dark:text-gray-300 italic mb-4">"{product.ai_reviews[activeReviewTab].summary}"</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                        <div>
                                            <h4 className="text-sm font-bold text-green-700 dark:text-green-400 mb-2">Pros</h4>
                                            <ul className="space-y-2">
                                                {product.ai_reviews[activeReviewTab].pros.map((pro, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-red-700 dark:text-red-400 mb-2">Cons</h4>
                                            <ul className="space-y-2">
                                                {product.ai_reviews[activeReviewTab].cons.map((con, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0"></div>
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* AI Buying Recommendation */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-100 dark:border-green-800/50 flex items-start gap-4 shadow-sm">
                            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full shrink-0">
                                <ShieldCheck className="text-green-600 dark:text-green-400" size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                    AI Suggestion: Buy from <span className="text-green-600 dark:text-green-400">{product.ai_recommendation.store}</span>
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                    {product.ai_recommendation.reason}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-green-200 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                                        Confidence Score: {product.ai_recommendation.score}/10
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price History */}
                        <div className="bg-white dark:bg-darkSurface rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900 p-5 border-b border-gray-100 dark:border-gray-800">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
                                    <TrendingUp className="text-primary" size={22} /> Price History
                                    <span className="text-xs font-normal text-gray-400 ml-1">(Last 3 Months)</span>
                                </h3>
                                <p className="text-xs text-gray-400 mt-1">Track price trends across all platforms to buy at the right time</p>
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {[
                                        { name: 'Amazon', color: '#FF9900' },
                                        { name: 'Flipkart', color: '#2874F0' },
                                        { name: 'Croma', color: '#0DB7AF' },
                                        { name: 'Meesho', color: '#F43397' },
                                    ].map(p => (
                                        <span key={p.name} className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                                            {p.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="h-80">
                                    <Line data={chartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
