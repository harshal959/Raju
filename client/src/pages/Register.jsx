import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Send, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        otp: '',
        password: ''
    });
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!formData.email) {
            setError('Please enter your email address first.');
            return;
        }

        setOtpLoading(true);
        try {
            await api.post('/auth/send-otp', { email: formData.email });
            setOtpSent(true);
            setMessage('OTP sent successfully! Please check your email inbox (and spam).');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otpSent) {
            setError('Please verify your email by sending an OTP first.');
            return;
        }

        setLoading(true);

        try {
            await api.post('/auth/register', formData);
            // On success, redirect to login
            setMessage('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background dark:bg-darkBackground transition-colors duration-300">
            <Navbar />

            <main className="flex-grow flex items-center justify-center py-20 px-4 relative overflow-hidden">
                {/* Background Blobs for Home-like vibe */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-darkSurface rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative z-10 border border-gray-100 dark:border-gray-800"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-primary"></div>

                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                            <p className="text-gray-500 dark:text-gray-400 text-sm">Join SmartPick today</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded-lg text-center font-medium border border-red-200 dark:border-red-800">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm rounded-lg text-center font-medium border border-green-200 dark:border-green-800">
                                {message}
                            </div>
                        )}

                        <form className="space-y-4" onSubmit={handleRegister}>
                            {/* Slot 1: Name */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                    <User size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>

                            {/* Slot 2: Email */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email</label>
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="you@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                        />
                                        <Mail size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={otpLoading || otpSent}
                                        className={`px-4 rounded-xl font-bold shadow-sm flex items-center justify-center transition-all ${otpSent ? 'bg-green-500 text-white cursor-default' : 'bg-primary text-white hover:bg-primaryDark'}`}
                                        title={otpSent ? "OTP Sent" : "Send OTP"}
                                    >
                                        {otpLoading ? (
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : otpSent ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            "Send OTP"
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Slot 3: OTP (Always visible as per request) */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">OTP</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="otp"
                                        placeholder="Enter 6-digit OTP"
                                        required
                                        value={formData.otp}
                                        onChange={handleChange}
                                        maxLength="6"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all tracking-widest text-center font-bold placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">Enter the code sent to your email above.</p>
                            </div>

                            {/* Slot 4: Password */}
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Create a strong password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 pl-10 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                                    />
                                    <Lock size={18} className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-secondary to-pink-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-secondary/30 flex items-center justify-center gap-2 disabled:opacity-70 mt-6"
                            >
                                {loading ? 'Registering...' : 'Sign Up'} <ArrowRight size={18} />
                            </motion.button>
                        </form>

                        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                            Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline">Sign In</Link>
                        </div>
                    </div>
                </motion.div>
            </main>
            <Footer />
        </div>
    );
};

export default Register;
