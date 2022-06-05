const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfigs');

const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport(nodemailerConfig);

    return transporter.sendMail({
        from: '"Iron Bank Of Braavos" <process.env.EMAIL>', // sender address
        to,
        subject,
        html,
    });
}

module.exports = sendEmail