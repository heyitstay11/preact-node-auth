/**
 * @module /index.js
 * @requires express
 * @requires cors
 * @requires cookie-parser
 * @requires module:middlewares/connectDB
 * @requires module:routes/userRoutes
 * 
 * @author Tayyab
 * @version 0.0.1
 */
const express = require('express');
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const { connectDB } = require('./middlewares/connectDB');
const userRouter = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const app = express();

if (process.env.NODE_ENV !== "production") {
    // Load environment variables from .env file in non prod environments
    require("dotenv").config();
}

/**
 * @constant {Array<string>} whitelist stores whitelist domain paths
 */
const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(',')
    : []

/**
 * @constant {Object} stores the options/config of cors middleware
 */
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
}

// Middlewares
connectDB(); // Connect to database
app.use(cors(corsOptions));
app.use(express.json()); // Middleware to accept json data
app.use(cookieParser(process.env.COOKIE_SECRET)); // set up cookie parser

/**
 * index route
 * @function
 * @name index-route
 * @param {string} path - Express path 
 * @param {callback} middleware - Express Middleware
 */
app.get('/', (req, res) => {
    res.send('Hello');
})


app.use('/user', userRouter); // user userRouter for /user routes

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));