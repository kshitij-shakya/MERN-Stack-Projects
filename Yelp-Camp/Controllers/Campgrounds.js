const Campground = require("../models/campground");
const { cloudinary } = require('../cloudinary');
const mapboxgl = require('mapbox-gl/dist/mapbox-gl.js');

const MBXGeoencoding = require('@mapbox/mapbox-sdk/services/geocoding');
const MapBoxToken = process.env.MAPBOX_TOKEN;
const GeoCoder = MBXGeoencoding({ accessToken: MapBoxToken });
module.exports.ListCampgrounds = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
}
module.exports.CreateCampgrounds = async(req, res, next) => {

    const GeoData = await GeoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.Images = req.files.map(f => ({ Url: f.path, FileName: f.filename }));
    campground.Geometry = GeoData.body.features[0].geometry;

    campground.Author = req.user._id;
    await campground.save();

    req.flash('success', "You Have Added A Campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.ShowCampgrounds = async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'Author' }
    }).populate("Author").populate("Images").populate("Geometry");
    if (!campground) {

        req.flash('Error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    const Arr = campground.Geometry;
    // console.log(Arr);

    res.render("campgrounds/show", { campground, Arr });
}

module.exports.Miscellaneous = async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'Author' }
    }).populate("Author");

    if (!campground) {
        req.flash('Error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { campground });
}

module.exports.Edit = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(req.params.id);

    if (!campground) {
        req.flash('Error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }

    res.render("campgrounds/edit", { campground });
}
module.exports.SaveCampgroundUpdates = async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground });
    const imgs = req.files.map(f => ({ Url: f.path, FileName: f.filename }));
    campground.Images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let FileName of req.body.deleteImages) {
            await cloudinary.uploader.destroy(FileName, function(result) {
                req.flash('Error', result);
                return res.redirect('/campgrounds');
            });
        }
        await campground.updateOne({ $pull: { images: { FileName: { $in: req.body.deleteImages } } } })
    }
    req.flash('success', "You Have Updated A Campground");
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.DeleteCampground = async(req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "You Have Deleted A Campground");

    res.redirect(`/campgrounds/`);
}