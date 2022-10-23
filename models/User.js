var {Schema, model} = require("../db/connection.js");

var UsersSchema = new Schema({
    username: {type: String, unique: true, required: true},
    password: {type: String, required: true}
});

var User = model("User", UsersSchema);

module.exports = User;