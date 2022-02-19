const mongoose = require("mongoose");
const Review = require('./Review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    Url: String,
    FileName: String
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.Url.replace('/upload', '/upload/w_200');
});
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    Images: [ImageSchema],
    description: String,
    location: String,

    Geometry: {
        coordinates: {
            type: [Number],
            required: true
        },
        type: {
            type: String,
            enum: ['Point'],
            required: true
        }

    },

    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],

    Author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});
CampgroundSchema.post('findOneAndDelete', async function(ground) {
    if (ground) {
        await Review.deleteMany({
            _id: {
                $in: ground.reviews
            }
        });
    }
})
module.exports = mongoose.model("Campground", CampgroundSchema);