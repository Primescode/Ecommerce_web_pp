const User = require('../../../models/userSchema');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

module.exports.user = (req, res) => {
    res.send('<h1>hiii there im from user</h1>');
};

module.exports.createSession = async (req, res) => {
    let {name, password, email} = req.body;
    try {
        await User.findOne({email: req.body.email}, async (err, user) => {
            if (err) {console.log(err);}
            if (!user) {
                var hashPassword = bcrypt.hashSync(password, 10);
                const newUser = new User({name, email, password: hashPassword});
                await newUser.save();
                return res.json({msg: "registed successfully"});
            }
            else {
                return res.json({msg: "user already registerd"});
            }
        });

    } catch (err) {
        if (err) {console.log(err);}
        res.status(404).json({"Error": err});
    }
};


module.exports.loginSession = async (req, res) => {
    const {email, password} = req.body;
    try {
        await User.findOne({email}, async (err, user) => {
            if (err) {console.log(err);}
            else if (!user) {
                res.status(404).json({msg: "Please Register First"});
            }
            else if (user) {
                let auth = await bcrypt.compare(password, user.password);
                console.log(auth);
                if (auth) {
                    var token = await jwt.sign({id: user._id}, process.env.ACCESSTOKEN_SECRET, {expiresIn: 100000});
                    console.log(token);
                    return res.status(200).json({data: token});
                }
                if (!auth) {
                    return res.status(200).json("Password didn'nt match");
                }
            }
            else {
                return res.status(404).json({msg: "user not found"});
            }
        });

    } catch (err) {
        if (err) {
            return res.status(404).json({"msg": err});
        }

    }

};

