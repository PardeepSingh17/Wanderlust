const listing = require("../models/schema.js")
const {listingSchema} = require("../schema.js")
const axios = require("axios");


module.exports.index = async (req, res) => {
    let allListings = await listing.find({})
    res.render("listings/index.ejs", {allListings})
}

module.exports.getNew = (req, res) => {
    res.render("listings/new.ejs")
}

module.exports.postNew = async (req, res) => {
    console.log("here" , req.file)
    const { cloudinary } = require("../cloudConfig");

    const result = await cloudinary.uploader.upload(req.file.path);

    let url = result.secure_url;
    let filename = result.public_id;

    

    let newListing = req.body.listing;

    await new Promise(resolve => setTimeout(resolve, 1000));

    const geoResponse = await axios.get("https://nominatim.openstreetmap.org/search", {
        params: {
            q: newListing.location,
            format: "json"
        },
        headers: {
    "User-Agent": "AirbnbClone/1.0 (student@project.com)"
}

    });

    if (!geoResponse.data || geoResponse.data.length === 0) {
        req.flash("error", "Location not found!");
        return res.redirect("/listing/new");
    }

    const latitude = geoResponse.data[0].lat;
    const longitude = geoResponse.data[0].lon;

    newListing.latitude = latitude;
    newListing.longitude = longitude;

    newListing.owner = req.user._id;
    newListing.image = {
        url: url,
        filename: filename
    };

    await listing.insertOne(newListing);
    req.flash("success", "New listing added successfully!");
    res.redirect("/listing");
};


module.exports.getEdit = async (req, res) => {
    let {id} = req.params
    let editListing = await listing.findById(id)
    if(!editListing){
        req.flash("error", "lisitng does not exist or deleted")
        res.redirect("/listing")
    } else {
        let originalImage = editListing.image.url
        originalImage = originalImage.replace("/upload", "/upload/w_250")
        res.render("listings/edit.ejs", {editListing, originalImage})
    }
    
}

module.exports.putEdit = async (req, res) => {
    let {id} = req.params
    let lisitng = await listing.findByIdAndUpdate(id, {...req.body.Edit})

    if(typeof req.file!== "undefined"){
        const { cloudinary } = require("../cloudConfig");

        const result = await cloudinary.uploader.upload(req.file.path);

        lisitng.image = {
            url: result.secure_url,
            filename: result.public_id
        };

        await lisitng.save();
    }
    
    req.flash("success", "Listing updated successfully!")
    res.redirect(`/listing/${req.params.id}`)
    
}

module.exports.delete = async (req, res) => {
    let {id} = req.params
    await listing.findByIdAndDelete(id)
    req.flash("success", "Listing deleted successfully!")
    res.redirect("/listing")
}

module.exports.show = async (req, res) => {
    let {id} = req.params
    let showListing = await listing.findById(id).populate({path : "reviews" , populate : {path : "owner"}}).populate("owner")
    if(!showListing){
        req.flash("error", "lisitng does not exist or deleted")
        res.redirect("/listing")
    } else {
        res.render("listings/show.ejs", {showListing})
    }
    
}