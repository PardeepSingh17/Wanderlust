const listing = require("./models/schema.js")
const review = require("./models/reviews.js")
const {listingSchema} = require("./schema.js")
const ExpressError = require("./utils/ExpressError.js")
const {reviewSchema} = require("./schema.js")


module.exports.isLoggedin = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl
        req.flash("error", "Please Login to do the action.")
        res.redirect("/user/login")
    } else {
        next()
    }
}

module.exports.saveRedirect = (req, res, next) => {
    if(req.session.redirectURL) {
        res.locals.redirectURL = req.session.redirectURL
    }
    next()
}

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params
    let Listing = await listing.findById(id)
    if(!Listing.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You're not the owner of this lisitng.")
        return res.redirect(`/listing/${req.params.id}`)
    }
    next()
}

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body)

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body)

    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg)
    } else {
        next()
    }
}


module.exports.isReviewOwner = async (req, res, next) => {
    let {reviewId} = req.params
    let Review = await review.findById(reviewId)
    if(!Review.owner._id.equals(res.locals.currentUser._id)){
        req.flash("error", "You're not the owner of this review.")
        return res.redirect(`/listing/${req.params.id}`)
    }
    next()
}