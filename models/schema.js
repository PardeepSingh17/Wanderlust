const { application } = require("express");
const mongoose = require("mongoose");
let Schema = mongoose.Schema;
const Review = require("./reviews.js")
const User = require("./user.js")

let listingSchema = new mongoose.Schema({
    title : {
        type : String
    },
    description : {
        type : String
    },
    image : {
        url : String,
        filename : String 
    },
    price : {
        type : Number
    },
    location : {
        type : String
    },
    country : {
        type : String
    },
    latitude : {
        type : Number
    },
    longitude : {
        type : Number
    },
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
})

listingSchema.post("findOneAndDelete", async (lisitng) => {
    if(lisitng) {
        await Review.deleteMany({_id : {$in : lisitng.reviews}})
    }
   
})

const listing = mongoose.model("listing", listingSchema);
module.exports = listing