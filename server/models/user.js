/**
 * Exports the user module
 * @module models/User
 * @requires mongoose
 * @requires bcrypt
 * 
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt'); 

/**
 *  Refresh Token Schema
 *  @constructor refresh token
 */
const Session = new Schema({
    refreshToken: {
        type: String,
        default: '',
    }
});

/**
 * User Schema
 * @constructor User
 */
const UserSchema = new Schema({
    firstName: {
        type: String,
        default: "",
    },
    lastName: {
        type: String,
        default: "",
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
        default: "",
    },
    refreshToken: {
        type: [Session],
    },
});


// Remove refreshToken from the response 
UserSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.refreshToken
        return ret
    },
});


// Pre Function to update password before saving
UserSchema.pre('save', async function(next){

    // update the password to a hashed one before saving in database
    this.password = await bcrypt.hash(this.password, 10);
    next(); // Move to next task
});



/**
 * Static method for logging in Users
 * @param {string} email 
 * @param {string} password 
 * @returns {Object} User Object
 * @throws will throw an error if the credentials are invalid
 */
UserSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email });
    if(!user) throw  Error('No Such User Exists');

    const isMatch = await bcrypt.compare(password, user.password);
    if(isMatch){
        return user;
    }
    throw  Error("Incorrect Password");
}


module.exports = mongoose.model('User', UserSchema)
