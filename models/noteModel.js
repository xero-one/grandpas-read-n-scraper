/*Set constant variable for npm mongoose*/
const mongoose = require("mongoose");

/*Initiate a new Schema with mongoose and saving it to a variable*/
const Schema = mongoose.Schema;

/*Build the schema full of objects and properties and saving it to a hard variable*/
const noteSchema = new Schema({
      _headlineID: {
          type: Schema.Types.ObjectID,
          ref: "headlineModel",
      },
      
      date: String,
      noteText: String
});

/*Save the built schema to a parent varaible that also ties the file its associated with and sets the "model" attribute to do work*/
const noteJS = mongoose.model("noteModel", noteSchema);

/*Export the parent variable we just set, so it is available throughout the app and so it can be used for routing*/
module.exports = noteJS;
  