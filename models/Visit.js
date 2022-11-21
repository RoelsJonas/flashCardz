var {Schema, model} = require("../db/connection.js");

var VisitSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    createdAt: { type: Date, default: Date.now, expires: 24 * 60 * 60}
});

// Composite key
VisitSchema.index({ user: 1, course: 1}, { unique: true });

var Visit = model("Visit", VisitSchema);
module.exports = Visit;