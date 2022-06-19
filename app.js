require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const passport = require('passport')
const passportJWT = require('./configs/passport-jwt-strategy');
const connectDB = require('./configs/connect');

const UserRouter = require('./routes/User');
const MoneyRouter = require('./routes/Money');
const AdminRouter = require('./routes/Admin');


const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.use(passport.initialize());
//app.use(passport.session());

app.get('/', (req, res) => {
    res.send('<h1>Iron Bank Of Braavos</h1>');
});

app.use('/api/v1/User', UserRouter);
app.use('/api/v1/Money', MoneyRouter);
app.use('/api/v1/Admin', AdminRouter);


const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server is listening on port http://localhost:${port}`)
        );
    } catch (error) {
        console.log(error);
    }
};

start();