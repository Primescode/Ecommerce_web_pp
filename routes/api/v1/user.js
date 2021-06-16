const express = require('express');
const router = express.Router();
const userApi = require("../../../controllers/api/v1/user_api");

router.get("/", userApi.user);
router.post("/create-session", userApi.createSession);
router.post("/login-session", userApi.loginSession);


module.exports = router;
