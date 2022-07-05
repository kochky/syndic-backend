const jwt =require('jsonwebtoken')
const User = require("../models/user")



module.exports={

    verifyToken : async (req, res, next) => {

        const authToken = req.get('Authorization');
        if (!authToken) {
            req.isAuth = false;
            return next()
        }
        const token = authToken.split(' ')[1];
        let verify;
        try {
            verify = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        } catch (error) {
            req.isAuth = false;
            return next()
        }
        if (!verify._id) {
            req.isAuth = false;
            return next()
        }
        const user = await User.findById(verify._id);
        if (!user) {
            req.isAuth = false;
            return next()
        }
       
        req.userId = user._id;
        req.isAuth = true;
        next()
    },

    verifyAdmin : async (req, res, next) => {

        const authToken = req.get('Authorization');
        if (!authToken) {
            req.isAdmin= false;
            return next()
        }
        const token = authToken.split(' ')[1];
        let verify;
        try {
            verify = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        } catch (error) {
            req.isAdmin = false;
            return next()
        }
        if (!verify._id) {
            req.isAdmin = false;
            return next()
        }
        const user = await User.findById(verify._id);
        if (!user) {
            req.isAdmin = false;
            return next()
        }
        if (!user.admin) {
            req.isAdmin = false;
            return next()
        }
        req.userId = user._id;
        req.isAdmin = true;
        next()
    }
}