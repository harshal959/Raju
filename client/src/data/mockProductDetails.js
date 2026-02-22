export const mockProductDetails = {
    id: "1",
    name: "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
    image: "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg",
    gallery: [
        "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-1.jpg",
        "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-2.jpg",
        "https://fdn2.gsmarena.com/vv/pics/apple/apple-iphone-15-pro-4.jpg"
    ],
    rating: 4.7,
    reviews_count: 3450,
    price: 127999,
    original_price: 149900,
    discount: 15,
    highlights: [
        "128 GB ROM",
        "15.49 cm (6.1 inch) Super Retina XDR Display",
        "48MP + 12MP + 12MP | 12MP Front Camera",
        "A17 Pro Chip, 6 Core Processor"
    ],
    price_comparison: [
        { store: "Amazon", price: 129900, logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", link: "https://amazon.in", best: false },
        { store: "Flipkart", price: 127999, logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png", link: "https://flipkart.com", best: true },
        { store: "Croma", price: 129990, logo: "/logos/croma.svg", link: "https://croma.com", best: false },
        { store: "Meesho", price: 135000, logo: "/logos/meesho.svg", link: "https://meesho.com", best: false }
    ],

    // Bank & Card Offers
    bank_offers: [
        { bank: "HDFC Bank", type: "Credit Card", discount: "₹5,000 Instant Discount", code: "Auto-applied", icon: "💳", color: "#004C8F" },
        { bank: "ICICI Bank", type: "Credit Card", discount: "₹4,000 Cashback", code: "ICICI4K", icon: "💳", color: "#F37021" },
        { bank: "SBI", type: "Credit & Debit Card", discount: "₹3,500 Instant Discount", code: "SBI3500", icon: "🏦", color: "#22409A" },
        { bank: "Axis Bank", type: "Credit Card", discount: "5% Unlimited Cashback", code: "Auto-applied", icon: "💳", color: "#97144D" },
        { bank: "Kotak", type: "Debit Card", discount: "₹2,500 Cashback", code: "KOTAK25", icon: "💳", color: "#ED1C24" },
        { bank: "BOB", type: "Credit Card", discount: "₹2,000 Instant Discount", code: "BOB2000", icon: "🏦", color: "#F26722" },
    ],

    // EMI Plans
    emi_plans: [
        { months: 3, monthly: 43333, interest: "No Cost EMI", banks: ["HDFC", "ICICI", "SBI", "Axis"] },
        { months: 6, monthly: 22167, interest: "No Cost EMI", banks: ["HDFC", "ICICI", "SBI"] },
        { months: 9, monthly: 15111, interest: "No Cost EMI", banks: ["HDFC", "ICICI"] },
        { months: 12, monthly: 11583, interest: "Low Interest", banks: ["HDFC", "SBI", "Axis", "Kotak"] },
        { months: 18, monthly: 8000, interest: "Standard EMI", banks: ["HDFC", "ICICI", "SBI"] },
        { months: 24, monthly: 6250, interest: "Standard EMI", banks: ["All Banks"] },
    ],

    // Sale & Discount Info
    sale_info: {
        active: true,
        name: "Republic Day Sale",
        end_date: "2026-02-28",
        extra_discount: 3,
        coupon_code: "REPUBLIC3",
        coupon_discount: "₹3,000 extra off",
        exchange_discount: "Up to ₹19,000 off on exchange",
        no_cost_emi: true,
    },

    // Store-specific offers
    offers: [
        { store: "Flipkart", description: "5% Unlimited Cashback on Flipkart Axis Bank Credit Card", type: "credit" },
        { store: "Amazon", description: "Flat ₹5,000 Instant Discount on HDFC Bank Credit Card", type: "credit" },
        { store: "Amazon", description: "₹3,500 Off on SBI Credit & Debit Cards", type: "both" },
        { store: "Croma", description: "Exchange Bonus up to ₹6,000 + Extra ₹2,000 on Croma Card", type: "exchange" },
        { store: "Flipkart", description: "No Cost EMI starting ₹11,583/month for 12 months", type: "emi" },
        { store: "Meesho", description: "Extra ₹1,500 Off with ICICI Credit Card", type: "credit" },
    ],

    // Protection Plans
    protection_plans: [
        { name: "SmartPick Complete Protection", duration: "1 Year", price: 4999, covers: ["Accidental Damage", "Screen Damage", "Water Damage", "Battery Replacement"] },
        { name: "Extended Warranty", duration: "2 Years", price: 3499, covers: ["Manufacturing Defects", "Battery Issues", "Software Glitches"] },
    ],

    ai_reviews: {
        amazon: {
            sentiment: "positive",
            summary: "Users love the build quality and camera. Some complaints about heating issues during charging.",
            pros: ["Premium Build", "Excellent Camera"],
            cons: ["Heating with 20W charger"]
        },
        flipkart: {
            sentiment: "mixed",
            summary: "Great delivery speed. Product is genuine. Mixed feelings about the battery life compared to 14 Pro.",
            pros: ["Fast Delivery", "Genuine Product"],
            cons: ["Average Battery Life"]
        },
        croma: {
            sentiment: "positive",
            summary: "Store pickup experience was smooth. Staff helped with data transfer. Phone feels lighter than previous gen.",
            pros: ["Store Experience", "Lightweight"],
            cons: ["Pricey Accessories"]
        },
        meesho: {
            sentiment: "mixed",
            summary: "Good price but delivery takes longer. Product is genuine but packaging could be better.",
            pros: ["Competitive Price", "Genuine Product"],
            cons: ["Slow Delivery", "Basic Packaging"]
        }
    },
    ai_recommendation: {
        store: "Flipkart",
        reason: "Lowest price across all platforms with No Cost EMI and fastest delivery. Use HDFC Credit Card for extra ₹5,000 off.",
        score: 9.2
    },
    price_history: {
        labels: ["Nov 1", "Nov 15", "Dec 1", "Dec 15", "Jan 1", "Jan 15", "Feb 1", "Feb 15"],
        datasets: [
            {
                label: "Amazon",
                data: [134900, 133000, 132500, 131000, 129900, 129900, 129900, 129500],
                borderColor: "#FF9900",
                backgroundColor: "rgba(255, 153, 0, 0.08)",
                tension: 0.4, borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: "#FF9900"
            },
            {
                label: "Flipkart",
                data: [134900, 131000, 129999, 128500, 127999, 127999, 126999, 127999],
                borderColor: "#2874F0",
                backgroundColor: "rgba(40, 116, 240, 0.08)",
                tension: 0.4, borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: "#2874F0"
            },
            {
                label: "Croma",
                data: [135000, 135000, 134000, 132000, 130000, 129990, 129990, 129990],
                borderColor: "#0DB7AF",
                backgroundColor: "rgba(13, 183, 175, 0.08)",
                tension: 0.4, borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: "#0DB7AF"
            },
            {
                label: "Meesho",
                data: [139000, 137500, 136000, 135500, 135000, 134500, 135000, 134000],
                borderColor: "#F43397",
                backgroundColor: "rgba(244, 51, 151, 0.08)",
                tension: 0.4, borderWidth: 2.5, pointRadius: 4, pointHoverRadius: 6, pointBackgroundColor: "#F43397"
            }
        ]
    }
};
