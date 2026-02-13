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
    highlights: [
        "128 GB ROM",
        "15.49 cm (6.1 inch) Super Retina XDR Display",
        "48MP + 12MP + 12MP | 12MP Front Camera",
        "A17 Pro Chip, 6 Core Processor"
    ],
    price_comparison: [
        { store: "Amazon", price: 129900, logo: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg", link: "https://amazon.in", best: false },
        { store: "Flipkart", price: 127999, logo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png", link: "https://flipkart.com", best: true },
        { store: "Croma", price: 129990, logo: "https://yt3.googleusercontent.com/ytc/AIdro_k2f9J8j-8q9E7iH8.jpg", link: "https://croma.com", best: false },
        { store: "Meesho", price: 135000, logo: "https://play-lh.googleusercontent.com/5IMjPq1ed_C40j8bgsO8P1b9f7s_d7_t1i2o3x4y5z6a7b8c9d0e1f2g3h4i5j6k", link: "https://meesho.com", best: false }
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
        }
    },
    ai_recommendation: {
        store: "Flipkart",
        reason: "Lowest price across all verify platforms and fastest delivery option available.",
        score: 9.2
    },
    offers: [
        { store: "Flipkart", description: "5% Unlimited Cashback on Flipkart Axis Bank Credit Card" },
        { store: "Amazon", description: "Flat INR 5000 Instant Discount on HDFC Bank Card" },
        { store: "Croma", description: "Exchange Bonus up to INR 6000" }
    ],
    price_history: {
        labels: ["Nov 1", "Nov 15", "Dec 1", "Dec 15", "Jan 1", "Jan 15", "Feb 1"],
        datasets: [
            {
                label: "Amazon",
                data: [134900, 133000, 132500, 131000, 129900, 129900, 129900],
                borderColor: "#FF9900", // Amazon Orange
                backgroundColor: "rgba(255, 153, 0, 0.1)",
                tension: 0.4
            },
            {
                label: "Flipkart",
                data: [134900, 131000, 129999, 128500, 127999, 127999, 126999],
                borderColor: "#2874F0", // Flipkart Blue
                backgroundColor: "rgba(40, 116, 240, 0.1)",
                tension: 0.4
            },
            {
                label: "Croma",
                data: [135000, 135000, 134000, 132000, 130000, 129990, 129990],
                borderColor: "#00B5B5", // Croma Teal
                backgroundColor: "rgba(0, 181, 181, 0.1)",
                tension: 0.4
            }
        ]
    }
};
