import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-16 mt-auto">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white tracking-tight">SmartPick</h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Curating the best products for you with AI-powered insights. Shop smarter, not harder.
                    </p>
                    <div className="flex space-x-4 pt-2">
                        <SocialIcon icon={<Facebook size={18} />} />
                        <SocialIcon icon={<Twitter size={18} />} />
                        <SocialIcon icon={<Instagram size={18} />} />
                        <SocialIcon icon={<Linkedin size={18} />} />
                    </div>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                    <ul className="space-y-3 text-sm">
                        <FooterLink>About Us</FooterLink>
                        <FooterLink>Contact</FooterLink>
                        <FooterLink>Careers</FooterLink>
                        <FooterLink>Blog</FooterLink>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-6">Support</h3>
                    <ul className="space-y-3 text-sm">
                        <FooterLink>Help Center</FooterLink>
                        <FooterLink>Terms of Service</FooterLink>
                        <FooterLink>Privacy Policy</FooterLink>
                        <FooterLink>Returns</FooterLink>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-semibold mb-6">Newsletter</h3>
                    <div className="flex flex-col gap-3">
                        <p className="text-sm text-gray-400">Subscribe for the latest trends and deals.</p>
                        <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
                            <input
                                type="email"
                                placeholder="Your email"
                                className="bg-transparent text-sm px-3 py-2 outline-none w-full text-white placeholder-gray-500"
                            />
                            <button className="bg-primary text-white p-2 rounded-md hover:bg-primaryDark transition-colors">
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-800 mt-16 pt-8 text-center text-sm text-gray-500">
                &copy; {new Date().getFullYear()} SmartPick Inc. All rights reserved.
            </div>
        </footer>
    );
};

const FooterLink = ({ children }) => (
    <li className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-gray-700 rounded-full"></span>
        {children}
    </li>
);

const SocialIcon = ({ icon }) => (
    <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-primary hover:text-white transition-all duration-300">
        {icon}
    </a>
);

export default Footer;
