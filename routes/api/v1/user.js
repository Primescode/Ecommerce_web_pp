const express = require('express');
const passport = require("passport");
const auth = require("../../../middleware/auth");
const {check} = require("express-validator/check");
const router = express.Router();
const userApi = require("../../../controllers/api/v1/user_api");

router.get("/",
    passport.authenticate("jwt", {session: false}),
    userApi.user
);

router.post("/sign-up",
    [
        check("name").not().isEmpty().withMessage("name is required"),
        check("email").isEmail().withMessage("Please enter valid email"),
        check("password").isLength({min: 6}).withMessage("Please enter 6 or more characters")
    ],
    userApi.signUp
);

router.post("/sign-in",
    [
        check("name").not().isEmpty().withMessage("name is required"),
        check("email").isEmail().withMessage("Please enter valid email"),
        check("password").isLength({min: 6}).withMessage("Please enter 6 or more characters")
    ],
    userApi.signIn
);

router.get("/sign-out",
    auth,
    userApi.destroySession
);


module.exports = router;
