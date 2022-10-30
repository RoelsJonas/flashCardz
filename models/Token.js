var {Schema, model} = require("../db/connection.js");

const TokenSchema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "user",
		unique: true,
	},
	token: { type: String, required: true },
	createdAt: { type: Date, default: Date.now, expires: 3600 },
});


var Token = model("Token", TokenSchema);

module.exports = Token;