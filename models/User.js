var {Schema, model} = require("../db/connection.js");

var UsersSchema = new Schema({
    username: {type: String, unique: true, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    verified: {type: Boolean, default: false}
});

var User = model("User", UsersSchema);

module.exports = User;