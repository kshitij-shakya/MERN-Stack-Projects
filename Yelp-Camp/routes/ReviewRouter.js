const express = require("express");
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Reviews = require("../models/Review");
const ReviewController = require("../Controllers/ReviewController");

const app = express();
const { IsLoggedIn, IsAuthorized, ValidateReview, ReviewIsAuthorized } = require('../Middleware/Middleware')
    // const methodOverride = require("method-override");
    // router.use(methodOverride('_method'))


router.post("/", IsLoggedIn, ValidateReview, catchAsync(ReviewController.AddReviews));

router.delete('/:reviewId', IsLoggedIn, ReviewIsAuthorized, catchAsync(ReviewController.DeleteReviews));

module.exports = router;