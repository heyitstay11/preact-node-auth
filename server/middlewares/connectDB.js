/**
 * Connect DB 
 * @module middlewares/connectDB
 * @requires mongoose
 * 
 * @description connectDB middleware  
 * connects the app to the mongo database
 * 
 */

const mongoose = require('mongoose');

/**
 * Creates connection to database
 * @function
 * @param {string} MONGO_URI path to mongo database local/cloud 
 */
const connectDB = () => {

    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(db => console.log('Connected to DB'))
    .catch(err => console.log(err));
}

module.exports = { connectDB };