const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js")
const {validateReview, isLoggedin, isReviewOwner} = require("../middleware.js")
const ExpressError = require("../utils/ExpressError.js")
const listing = require("../models/schema.js")
const Review = require("../models/reviews.js")

const reviewController = require("../controllers/reviews.js")




router.post("/" ,isLoggedin, validateReview , wrapAsync(reviewController.postNew))

router.delete("/:reviewId",isLoggedin, isReviewOwner, wrapAsync(reviewController.delete))

module.exports = router;