require('dotenv').config();
const nodemailer = require('nodemailer');

const testEmail = async () => {
    console.log('Testing email configuration...');
    console.log('User:', process.env.EMAIL_USER);
    // Don't log the full password for security, just length
    console.log('Password Length:', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER, // Send to self
            subject: 'Test Email from SmartPick',
            text: 'If you see this, email sending is working!'
        });
        console.log('✅ Email sent successfully!');
        console.log('Response:', info.response);
    } catch (error) {
        console.error('❌ Error sending email:');
        console.error(error);
    }
};

testEmail();
