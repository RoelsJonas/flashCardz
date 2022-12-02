var {Schema, model} = require("../db/connection.js");

var UsersSchema = new Schema({
    username: {type: String, unique: true, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean, default: false},
    profilePicture: {type: Schema.Types.ObjectId, ref: 'Image' }
});

// Virtual for author's URL
UsersSchema.virtual("url").get(function () {
    // We don't use an arrow function as we'll need the this object
    return `/user/${this._id}`;
});
  
var User = model("User", UsersSchema);
module.exports = User;