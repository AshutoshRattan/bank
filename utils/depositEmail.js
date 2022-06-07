const sendEmail = require('./sendEmail');

const depositEmail = async (transaction, user) => {
    return sendEmail({
        to: user.email,
        subject: 'deposit',
        html: `<h1>${transaction.amount} has been deposited to ${user.id} </h1>`,
    });
};

module.exports = depositEmail;
