import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('smartpick_cart');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem('smartpick_wishlist');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('smartpick_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('smartpick_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id || item.name === product.name);
            if (existing) {
                return prev.map(item =>
                    (item.id === product.id || item.name === product.name)
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId && item.name !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item =>
            (item.id === productId || item.name === productId)
                ? { ...item, quantity }
                : item
        ));
    };

    const addToWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id || item.name === product.name);
            if (exists) return prev;
            return [...prev, product];
        });
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(item => item.id !== productId && item.name !== productId));
    };

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId || item.name === productId);
    };

    const isInCart = (productId) => {
        return cart.some(item => item.id === productId || item.name === productId);
    };

    const moveToCart = (product) => {
        addToCart(product);
        removeFromWishlist(product.id || product.name);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const wishlistCount = wishlist.length;

    return (
        <CartContext.Provider value={{
            cart, wishlist, cartTotal, cartCount, wishlistCount,
            addToCart, removeFromCart, updateQuantity,
            addToWishlist, removeFromWishlist, isInWishlist, isInCart, moveToCart
        }}>
            {children}
        </CartContext.Provider>
    );
};
