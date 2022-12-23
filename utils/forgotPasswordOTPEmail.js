const sendEmail = require('./sendEmail');

const forgotPasswordOTPEmail = async (user, OTP) => {
    return sendEmail({
        to: user.email,
        subject: 'forgot password OTP',
        html: `<h1>Your OTP is ${OTP}</h1>`,
    });
};

module.exports = forgotPasswordOTPEmail;
