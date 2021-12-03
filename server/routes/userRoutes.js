/**
 * Express Router providing user related Routes
 * @module routes/userRoutes
 * @requires express
 * @requires module:models/user
 * @requires jsonwebtoken
 */


const router = require('express').Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { getJWTToken, 
        getRefreshToken, 
        COOKIE_OPTIONS, 
        requireAuth  } = require('../middlewares/authMiddlewares');

/**
 * Route for getting user data
 * @name get-userData
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express path 
 * @param {callback} middleware - Express Middleware
 */
router.get('/myData', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.user?.id, {_id: 0,password: 0, __v:0 });
        res.json(user);
    } catch (error) {
        res.status(500).json({error});
    }
});


/**
 * Route for signing up users
 * @name post-signup
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express path 
 * @param {callback} middleware - Express Middleware
 */
router.post('/signup', async (req, res) => {
    const {firstName, lastName, email, password} = req.body;
    try {
        let user = await User.findOne({ email });

        if(user){
            return res.status(400).json({ msg: "User with this email already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        user = await User.create({firstName, lastName, email, password: hashedPassword});

        const [jwtToken, refreshToken] = [getJWTToken({ id: user._id}), getRefreshToken({ id: user._id})];

        await User.updateOne(
            { "_id" : user._id }, 
            { $push: { "refreshToken": { refreshToken }}
        });

        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.status(201).json({ token: jwtToken , id: user._id });
    } catch (error) {
        res.status(500).json({error});
    }
});


/**
 * Route for signing up users
 * @name post-login
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express path 
 * @param {callback} middleware - Express Middleware
 */
router.post('/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await User.login(email, password);
        const [jwtToken, refreshToken] = [getJWTToken({ id: user._id}), getRefreshToken({ id: user._id})];
        
        await User.updateOne(
            { "_id": user._id },
            { $push : { "refreshToken": { refreshToken }}
        });
        
        // console.log(user.refreshToken);
        res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
        res.json({token: jwtToken, id: user._id });
    } catch (error) {
        if(error.message){
            error = error.message;
        }
        console.log({error});
        res.status(401).json({error});
    }
});

/** 
 * Route for refreshing Tokens
 * @name post-refresh
 * @function
 * @memberof module:routes/userRoutes
 * @param {string} path - Express path 
 * @param {callback} middleware - Express Middleware
 */
router.post('/refresh', async (req, res) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    if(!refreshToken){
       return res.status(401).json({message: "No Token Provided"});
    }
   
    try {
        const { id : userId } = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
        const user = await User.findById(userId);
        if(!user) return res.status(401).json({message: "No User Found"});

        const tokenIndex = user.refreshToken.findIndex(token => token.refreshToken === refreshToken);

        if(tokenIndex === -1){
           return res.status(401).json({message: "Invalid Token"});
        }
        // creating new Tokens
        const [jwtToken, newRefreshToken] = [getJWTToken({ id: userId }), getRefreshToken({ id: userId })];
        // Replacing the refreshToken in Database 
        user.refreshToken[tokenIndex] = { "refreshToken": newRefreshToken}
        
        await user.save(); // Saving the user with updated refreshToken

        res.cookie('refreshToken', newRefreshToken, COOKIE_OPTIONS);
        res.json({token: jwtToken, id: userId });
    } catch (error) {
        console.log({error});
        res.status(500).json({error});
    }
});


/**
 * @name post-Logout
 * @function 
 * @description Handles logout function
 * @param {string} path - Express path 
 * @param {callback} middleware - Express Middleware
 */
router.post('/logout', requireAuth , async (req, res) => {
    const { signedCookies = {} } = req;
    const { refreshToken } = signedCookies;

    try {
        const user = await User.findById(req.user?.id);
        if(!user) return res.status(401).json({message: "No User Found"});

        const tokenIndex = user.refreshToken.findIndex(token => token.refreshToken === refreshToken);
        if(tokenIndex !== -1){

            await User.updateOne(
               { _id: user._id},
               { $pull: { refreshToken: { refreshToken: refreshToken}}}
           );
    
           res.cookie("refreshToken", '',{ ...COOKIE_OPTIONS, maxAge: 1});
           res.json({ success: true , id : user._id})
        }else{
            console.log('error')
            return res.status(401).json({message: "Invalid Token"});
        }
    } catch (error) {
        res.status(500).json({ error })
    }
})

module.exports = router;