const sendEmail = require('./sendEmail');

const transactionEmail = async (transaction, {user1, user2}) => {
    return sendEmail({
        to: [user1.email, user2.email],
        subject: 'transaction',
        html: `<h1>from ${user1.id}, to ${user2.id}, amount ${transaction.amount}</h1>`,
    });
};

module.exports = transactionEmail;
