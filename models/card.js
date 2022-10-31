var {Schema, model} = require("../db/connection.js");

var CardSchema = new Schema({
    creatorId: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: "creator",
	},
    courseId:{
        type: Schema.Types.ObjectId,
		required: true,
		ref: "course",
    },
    title: {type: String},
    front: {type: String, required: true},
    back: {type: String, required: true},

});

var Card = model("Card", CardSchema);

module.exports = Card;