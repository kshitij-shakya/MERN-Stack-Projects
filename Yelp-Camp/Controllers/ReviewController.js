const Reviews = require("../models/Review");
const Campground = require("../models/campground");

module.exports.AddReviews = async(req, res) => {
    // res.send("You Made Bro You Madve Till here");
    const Campgrounds = await Campground.findById(req.params.id);
    const Review = new Reviews(req.body.Review);
    Review.Author = req.user._id;
    Campgrounds.reviews.push(Review);
    await Review.save();
    await Campgrounds.save();
    req.flash('success', "You Have Added A Review");

    res.redirect(`/campgrounds/${Campgrounds._id}`);
}
module.exports.DeleteReviews = async(req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Reviews.findByIdAndDelete(reviewId);
    req.flash('success', "You Have Deleted A Review");

    res.redirect(`/campgrounds/${id}`);
}