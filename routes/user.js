const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const User = require("../models/user.js")
const passport = require("passport");
const { isLoggedin, saveRedirect } = require("../middleware.js");

const userController = require("../controllers/user.js")

//signUP
router.get("/signup" , userController.signupForm )

router.post("/signup", wrapAsync(userController.signup))

//login
router.get("/login", userController.loginForm)

router.post("/login",saveRedirect, passport.authenticate("local", {failureRedirect : "/user/login", failureFlash: true} ) ,wrapAsync(userController.login))

//logout
router.get("/logout",isLoggedin, userController.logout)

module.exports = router