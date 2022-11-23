var {Schema, model} = require("../db/connection.js");

const CourseSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    code: {type: String, required: false},
    school: {type: String, required: false},
    creator: {type: Schema.Types.ObjectId, ref:"User", required: true},
    public: {type: Boolean, default: true},
    numCards: {type: Number, default: 0},
    numFavorites: {type: Number, default: 0},
    numVisits: {type: Number, default: 0},
    image: [{ type: Schema.Types.ObjectId, ref: 'Image' }]
});

CourseSchema.virtual("url").get(function () {
    return `/courses/course${this._id}`;
});

module.exports = model("Course", CourseSchema);