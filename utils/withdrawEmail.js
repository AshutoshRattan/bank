const sendEmail = require('./sendEmail');

const withdrawEmail = async (transaction, user) => {
    return sendEmail({
        to: user.email,
        subject: 'withdraw',
        html: `<h1>${-1 * transaction.amount} has been withdrawn from ${user._id} </h1>`,
    });
};

module.exports = withdrawEmail;
