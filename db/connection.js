const mongoose = require("mongoose");
const {log} = require("mercedlogger");
const mongoDB = "mongodb+srv://Jonil:Jonil123@flashcardz.7w8whn4.mongodb.net/flashcardz?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

module.exports = mongoose;