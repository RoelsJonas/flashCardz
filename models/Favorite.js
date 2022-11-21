var {Schema, model} = require("../db/connection.js");

var FavoriteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' }
});

// Composite key
FavoriteSchema.index({ user: 1, course: 1}, { unique: true });

var Favorite = model("Favorite", FavoriteSchema);
module.exports = Favorite;