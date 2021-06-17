const User = require('../../../models/userSchema');
const {validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

module.exports.user = (req, res) => {
    console.log(req.user);
    console.log(req.body);
    return res.send('<h1>hiii there im from user</h1>');
};

module.exports.signUp = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    let {name, password, email} = req.body;
    try {
        await User.findOne({email: req.body.email}, async (err, user) => {
            if (err) {console.log("Error in finding user in database ", err);}
            if (!user) {
                var hashPassword = bcrypt.hashSync(password, 10);
                user = new User({name, email, password: hashPassword});
                await user.save();
                console.log("user.save");

                let token = await jwt.sign({id: user._id}, process.env.ACCESSTOKEN_SECRET, {expiresIn: "1d"});
                console.log(token);
                if (token) {
                    return res.json({message: "Resgister successfully", data: {auth: true, token: token}});
                }
            }
            // handling if user already in databse 
            else if (user) {
                return res.status(400).json({message: "user already registerd"});
            }
            else {
                res.status(401).send("invalid authentication");
            }
        });
    } catch (err) {
        if (err) {console.log(err);}
        res.status(404).json({"Error": err});
    }
};


module.exports.signIn = async (req, res) => {
    const {email, password} = req.body;
    try {
        // finding the user in database 
        await User.findOne({email}, async (err, user) => {
            if (err) {console.log(err);}
            else if (!user) {
                res.status(404).json({message: "User not registered"});
            }
            // if user found then 
            else if (user) {
                let isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(200).json({message: "Password didn'nt match", data: {auth: false}});
                }
                if (isMatch) {
                    var token = await jwt.sign({id: user._id}, process.env.ACCESSTOKEN_SECRET, {expiresIn: "1d"});
                    return res.status(200).json({message: "login successully", data: {token: token}});
                }
            }
            else {
                return res.status(404).json({message: "user not found"});
            }
        });
    } catch (err) {
        if (err) {
            return res.status(404).json({message: err});
        }
    }
};

module.exports.destroySession = (req, res) => {
    return res.header();
};


