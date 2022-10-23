var {Schema, model} = require("../db/connection.js");

const CourseSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    code: {type: String, required: false},
    school: {type: String, required: false},
    creator: {type: Schema.Types.ObjectId, ref:"User", required: true}
});

CourseSchema.virtual("url").get(function () {
    return `/courses/course${this._id}`;
});

module.exports = model("Course", CourseSchema);