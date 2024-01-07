const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thesammet@gmail.com',
        pass: '123304219'
    }
});

const sendEmail = async (to, subject, text) => {
    try {
        const mailOptions = {
            from: 'thesammet@gmail.com',
            to: to,
            subject: subject,
            text: text
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = { sendEmail };
