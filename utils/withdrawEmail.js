const sendEmail = require('./sendEmail');

const withdrawEmail = async (transaction, user) => {
    return sendEmail({
        to: user.email,
        subject: 'deposit',
        html: `<h1>${-1 * transaction.amount} has been withdrawn from ${user.id} </h1>`,
    });
};

module.exports = withdrawEmail;
