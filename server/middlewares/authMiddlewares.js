/**
 * Exports all the auth related middlewares
 * @module middlewares/authMiddlewares
 * @requires jsonwebtoken
 * 
 */

const jwt = require('jsonwebtoken');
const dev = process.env.NODE_ENV !== "production";

/**
 * @constant {number} REFRESH_TOKEN_EXPIRY specifies the validity of a token in seconds
 */
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60; // 30days

/**
 * @constant {number} JWT_TOKEN_EXPIRY specifies the validity of a token in minutes
 */
const JWT_TOKEN_EXPIRY = 15 * 60; // 15 minutes

/**
 * COOKie Options object
 * @typedef {Object} COOKIE_OPTIONS_TYPE
 * @property {boolean} httpOnly 
 * @property {boolean} secure 
 * @property {boolean} signed 
 * @property {integer} maxAge 
 * @property {integer} sameSite 
 */

/**
 * @constant {COOKIE_OPTIONS_TYPE} COOKIE_OPTIONS specifies the cookie options that will be used
 */
COOKIE_OPTIONS = {
    httpOnly: true,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure: !dev,
    signed: true,
    maxAge: REFRESH_TOKEN_EXPIRY * 1000,
    sameSite: "none",
}


/**
 * create a jwt token using the uid of user
 * @param {string} id specifices the uid of the user 
 * @returns {string} encrypted jwt token 
 */
 const getJWTToken = ( id ) => {
    const jwtToken =  jwt.sign(id, process.env.JWT_SECRET, {
        expiresIn: JWT_TOKEN_EXPIRY,
    });
    return jwtToken;
}

/**
 * create a refresh token using the uid of user
 * @param {string} id specifices the uid of the user 
 * @returns {string} encrypted jwt token 
 */
const getRefreshToken = ( id ) => {
    const refreshToken = jwt.sign(id, process.env.REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
    return refreshToken
}

/**
 * 
 * @param {Object} req request object with data from client 
 * @param {Object} res response  
 * @param {callback} next  express middleware
 * @returns {callback} if successful moves to next middleware
 */
const requireAuth = async (req, res, next) => {
    const token = req.headers["x-auth-token"];
    
    if(!token){
        return res.status(401).json({msg: "No Token Provided"});
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        res.status(401).json({msg: "Invalid Token"});
    }
}


module.exports = {
    getJWTToken,
    getRefreshToken,
    COOKIE_OPTIONS,
    requireAuth,
}