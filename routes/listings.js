const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const listing = require("../models/schema.js")
const {isLoggedin, isOwner, validateListing} = require("../middleware.js")

const lisitngController = require("../controllers/listing.js")

//index route
router.get("/", wrapAsync(lisitngController.index))

//new listing
router.get("/new",isLoggedin, lisitngController.getNew)

router.post("/", isLoggedin ,validateListing , upload.single("listing[image]") , wrapAsync(lisitngController.postNew))


//edit listing
router.get("/edit/:id" ,isLoggedin, isOwner, wrapAsync(lisitngController.getEdit))

router.put("/:id",isLoggedin,isOwner,upload.single("Edit[image]"),  wrapAsync(lisitngController.putEdit))

//delete listing
router.delete("/:id" ,isLoggedin,isOwner,  wrapAsync(lisitngController.delete))

//show route
router.get("/:id" , wrapAsync(lisitngController.show))

module.exports = router;
