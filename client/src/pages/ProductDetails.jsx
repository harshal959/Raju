import React, { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Truck, RotateCcw, TrendingUp, Sparkles, ExternalLink, ArrowLeft, Tag } from 'lucide-react';
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
import { mockProductDetails } from '../data/mockProductDetails'; // Import mock data

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

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // Use the search query from URL, or fallback to the ID/default
                const query = queryParam || "Apple iPhone 15 Pro (128 GB) - Natural Titanium";

                // Fetch from Python Service
                const response = await axios.get(`http://localhost:5000/scrape?query=${encodeURIComponent(query)}`);

                // Merge scraped data with static details (images, highlights) that might not be scraped easily
                // or just use mock structure if scraping returns failure.

                const scrapedData = response.data;

                // Combine with base mock data for static fields (images, highlights) 
                // because our simple scraper doesn't get images/highlights yet.
                const baseData = mockProductDetails;

                const finalProduct = {
                    ...baseData, // Keep baseData only for structure safe-keeping
                    name: scrapedData.name || (queryParam ? query : baseData.name),
                    image: scrapedData.image || "https://placehold.co/400x400?text=No+Image",
                    rating: scrapedData.rating || 0,
                    reviews_count: scrapedData.reviews_count || 0,

                    // Only use baseData gallery if we are indeed looking at the iPhone (default), otherwise empty
                    gallery: queryParam ? [scrapedData.image || "https://placehold.co/400x400?text=No+Image"] : baseData.gallery,
                    highlights: queryParam ? [] : baseData.highlights, // Clear highlights for custom search

                    price_comparison: scrapedData.price_comparison && scrapedData.price_comparison.length > 0 ? scrapedData.price_comparison : [],
                    ai_recommendation: scrapedData.ai_recommendation || { store: "-", reason: "No data available", score: 0 },
                    price_history: scrapedData.price_history || { labels: [], datasets: [] }
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
                    price_comparison: [],
                    ai_recommendation: { store: "-", reason: "Could not fetch data. Please try again.", score: 0 },
                    price_history: { labels: [], datasets: [] }
                });
                setSelectedImage(mockProductDetails.image); // Keep default image for now
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
            borderColor: '#4f46e5',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
        }))
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        scales: {
            y: {
                beginAtZero: false,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
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

                        {/* Bank Offers (Moved to Left) */}
                        <div className="space-y-3">
                            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Tag className="text-secondary" size={20} /> Bank Offers
                            </h3>
                            {product.offers.map((offer, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                    <Tag size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 block">{offer.store}</span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">{offer.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Details */}
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center bg-green-600 text-white px-2 py-0.5 rounded text-sm font-bold">
                                    {product.rating} <Star size={12} className="ml-1 fill-white" />
                                </div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm">{product.reviews_count.toLocaleString()} Reviews</span>
                                <span className="text-green-600 text-sm font-medium">In Stock</span>
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
                        <div className="bg-white dark:bg-darkSurface p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <TrendingUp className="text-primary" size={20} /> Price History (Last 3 Months)
                            </h3>
                            <div className="h-64">
                                <Line data={chartData} options={chartOptions} />
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
