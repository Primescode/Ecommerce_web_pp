const User = require('../../../models/userSchema');

module.exports.user = (req, res) => {
    res.send('<h1>hiii there im from user</h1>');
};
module.exports.createSession = (req, res) => {
    console.log(req.body);

    User.findOne({email: req.body.email}, function (err, user) {
        if (err) {
            console.log(err);
            return;
        }

        if (!user) {
            if (req.body.password < 6) {
                return res.status(400).json({message: "password is at least 6 character long"});
            }
            User.create(req.body, function (err, user) {
                if (err) {
                    console.log(err);
                    return;
                }
                res.json({message: "user created successfullly"});
            });
        }
        res.send({message: "user already exists"});
    });

};