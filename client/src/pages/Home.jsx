import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';

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
    }
];

const categories = [
    { name: 'Mobiles', img: 'https://rukminim2.flixcart.com/flap/64/64/image/22fddf3c7da4c4f4.png?q=100' },
    { name: 'Fashion', img: 'https://rukminim2.flixcart.com/flap/64/64/image/c12afc017e6f24cb.png?q=100' },
    { name: 'Electronics', img: 'https://rukminim2.flixcart.com/flap/64/64/image/69c6589653afdb9a.png?q=100' },
    { name: 'Home', img: 'https://rukminim2.flixcart.com/flap/64/64/image/ab7e2b022a4587dd.jpg?q=100' },
    { name: 'Appliances', img: 'https://rukminim2.flixcart.com/flap/64/64/image/0ff199d1bd27eb98.png?q=100' },
    { name: 'Travel', img: 'https://rukminim2.flixcart.com/flap/64/64/image/71050627a56cb908.png?q=100' },
    { name: 'Grocery', img: 'https://rukminim2.flixcart.com/flap/64/64/image/29327f40e9c4d26b.png?q=100' },
];

const Home = () => {
    return (
        <div className="min-h-screen flex flex-col pt-20 bg-background dark:bg-darkBackground transition-colors duration-300">
            <Navbar />

            <main className="flex-grow space-y-12 pb-12">
                {/* Hero Section */}
                <section className="container mx-auto px-6 mt-6">
                    <div className="bg-gradient-to-r from-primary to-primaryDark rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-primary/30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>

                        <div className="relative z-10 max-w-2xl">
                            <motion.span
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/20 backdrop-blur-sm text-sm font-semibold px-4 py-1.5 rounded-full inline-block mb-4 border border-white/10"
                            >
                                <Sparkles size={14} className="inline mr-2" />
                                AI-Powered Curation
                            </motion.span>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
                            >
                                Discover Intelligence in <br />Every Purchase.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-lg text-gray-200 mb-8 max-w-lg"
                            >
                                Compare prices, analyze sentiment, and get personalized recommendations across all major platforms.
                            </motion.p>
                            <Link to="/products">
                                <motion.button
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="bg-white text-primary font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all flex items-center gap-2"
                                >
                                    Start Exploring <ArrowRight size={18} />
                                </motion.button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Categories</h2>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="flex flex-col items-center justify-center p-3 sm:p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100 group aspect-square sm:aspect-auto"
                            >
                                <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3 bg-gray-50 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                    <img src={cat.img} alt={cat.name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-gray-600 group-hover:text-primary transition-colors text-center">{cat.name}</span>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-1 block">Top Picks</span>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                Trending Products <TrendingUp className="text-secondary" />
                            </h2>
                        </div>
                        <Link to="/products" className="text-primary font-semibold hover:underline">View All</Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {mockProducts.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="h-full"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* AI Suggestion Banner */}
                <section className="container mx-auto px-6">
                    <div className="bg-gray-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="z-10 max-w-lg">
                            <h2 className="text-3xl font-bold mb-4">AI Recommended For You</h2>
                            <p className="text-gray-400 mb-6">Based on your recent search for "Wireless Headphones", we found these top-rated picks with the best price history.</p>
                            <button className="bg-secondary text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-pink-600 transition-colors">
                                View Recommendations
                            </button>
                        </div>
                        <div className="grid grid-cols-2 gap-4 z-10 w-full md:w-auto">
                            {mockProducts.slice(0, 2).map((product) => (
                                <div key={`ai-${product.id}`} className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                    <img src={product.image} alt={product.name} className="w-full h-24 object-contain mb-2 mix-blend-add" />
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
