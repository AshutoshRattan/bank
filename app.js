require('dotenv').config();
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const authenticateUser = require('./middleware/authentication');
const UserRouter = require('./routes/User');
const MoneyRouter = require('./routes/Money');

const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('<h1>Jobs API</h1><a href="/api-docs">Documentation</a>');
});

app.use('/api/v1/User', UserRouter);
app.use('/api/v1/Money', MoneyRouter);


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