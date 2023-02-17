require('dotenv').config();
require('express-async-errors');  // This is a package that allows us to use async/await in our routes

const express = require('express');
const app = express();
const connectDB = require('./db/connect');
const productsRouter = require('./routes/products');

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler')



// middleware
app.use(express.json());  // This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.


// routes
app.get('/', (req, res) => {
    res.send('<h1>Store API</h1><a href="/api/v1/products">Products route</a>')});
app.use('/api/v1/products', productsRouter);


//products route

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000;


const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
    };

start();