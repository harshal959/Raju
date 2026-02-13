require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const users = await User.find({});
        console.log('--- Registered Users ---');
        if (users.length === 0) {
            console.log('No users found.');
        } else {
            users.forEach(user => {
                console.log({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    password: user.password, // This will be the hashed string
                    isVerified: user.isVerified,
                    createdAt: user.createdAt
                });
            });
        }
        console.log('------------------------');

        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkDb();
