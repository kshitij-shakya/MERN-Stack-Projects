const express = require("express");
const path = require("path");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Campgrounds = require("../Controllers/Campgrounds");
const { IsLoggedIn, IsAuthorized, ValidateCampground } = require("../Middleware/Middleware")
const { storage } = require('../cloudinary');
const multer = require('multer');
const upload = multer({ storage });
console.log(IsLoggedIn)


router.route("/")
    .get(catchAsync(Campgrounds.ListCampgrounds))
    .post(IsLoggedIn, upload.array('Images'), ValidateCampground, catchAsync(Campgrounds.CreateCampgrounds));
// .post(upload.array('Images'), (req, res) => {
//     console.log(req.files);
//     res.send("Did It Work?", req.files);
// })
router.get("/new", IsLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.route("/:id")
    .get(catchAsync(Campgrounds.ShowCampgrounds))
    .put(IsLoggedIn, IsAuthorized, upload.array('Images'), ValidateCampground, catchAsync(Campgrounds.SaveCampgroundUpdates))
    .delete(IsLoggedIn, IsAuthorized, catchAsync(Campgrounds.DeleteCampground));



router.get("/:id/edit", IsLoggedIn, IsAuthorized, catchAsync(Campgrounds.Edit));

router.get("/:id/*", IsLoggedIn, catchAsync(Campgrounds.Miscellaneous));

module.exports = router;