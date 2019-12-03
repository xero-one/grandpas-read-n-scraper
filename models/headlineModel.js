/*Set constant variable for npm mongoose*/
const mongoose = require("mongoose");

/*Initiate a new Schema with mongoose and saving it to a variable*/
const Schema = mongoose.Schema;

/*Build the schema full of objects and properties and saving it to a hard variable*/
const headlineSchema = new Schema({
      headline: {
          type: String,
          required: true,
      },
      url: {
        type: String,
        required: true
      },
      summary: {
          type: String,
          required: true
      },
      saved: {
          type: Boolean,
          default: false
      },
      note: [{
        type: Schema.Types.ObjectId,
        ref: "noteModel"
      }]   
      
});

/*Save the built schema to a parent varaible that also ties the file its associated with and sets the "model" attribute*/
const headlineJS = mongoose.model("headlineModel", headlineSchema);

/*Export the parent variable we just set, so it is available throughout the app and so it can be used for routing*/
module.exports = headlineJS;
  