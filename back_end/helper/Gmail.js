const nodemailer = require('nodemailer');
require('dotenv').config();
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_ACCOUNT || "duclee025@gmail.com",
        pass: process.env.GMAIL_PASSWORD || "gxxnbrdrqutczioh"
    }
});

const sendMail = (to, subject, html) => {
    let mailOptions = {
        from: process.env.GMAIL_ACCOUNT,
        to,
        subject,
        html
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });

}

module.exports = { sendMail }
