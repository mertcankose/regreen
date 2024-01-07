const nodemailer = require("nodemailer");

const emailEvent = (to, message) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: data.email,
            subject: "Your New Password",
            html: `<p>${message}</p>`,
        });

        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.log("err: ", err);
    }
};

module.exports = emailEvent;