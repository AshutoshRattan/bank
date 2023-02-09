const sendEmail = require('./sendEmail');

const transactionEmail = async ({user1, user2, amount}) => {
    return sendEmail({
        to: [user1.email, user2.email],
        subject: 'transaction',
        html: `<h1>from ${user1._id}, to ${user2._id}, amount ${amount}</h1>`,
    });
};

module.exports = transactionEmail;
