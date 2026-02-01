const listing = require("../models/schema.js")
const Review = require("../models/reviews.js")

module.exports.postNew = async(req, res) => {
    let Listing = await listing.findById(req.params.id)
    let newReview = new Review(req.body.review)
    newReview.owner = req.user._id

    Listing.reviews.push(newReview)

    await newReview.save()
    await Listing.save()
    req.flash("success", "Review added successfully!")
    res.redirect(`/listing/${req.params.id}`)
}

module.exports.delete = async (req, res) => {
    let {id , reviewId} = req.params
    await listing.findByIdAndUpdate(id, {$pull: {reviews : reviewId} })
    await Review.findByIdAndDelete(reviewId)
    req.flash("success", "Review deleted successfully!")
    res.redirect(`/listing/${id}`)
}