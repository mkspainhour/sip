//SECTION: Setup
"use strict";

const mongoose = require("mongoose");
  mongoose.Promise = global.Promise;





//SECTION: Model Description
const cocktailSchema = mongoose.Schema({
  name: {type: String, required: true, trim: true},
  creator: {type: String, required: true, trim: true},
  ingredients: {
    type: [{
      _id: false,
      amount: {type: Number, required: true, min: 0},
      measurementUnit: {type: String, required: true, trim: true},
      name: {type: String, required: true, trim: true}
    }],
    required: true
  },
  directions: {type: String, trim: true},
  //createdAt timestamp
  //updatedAt timestamp
}, {timestamps: true});





//SECTION: Static Model Methods
cocktailSchema.methods.serialize = function() {
  return {
    id: this._id,
    name: this.name,
    creator: this.creator,
    ingredients: this.ingredients,
    directions: this.directions
  }
}





//SECTION: Model Compilation
const Cocktail = mongoose.model("Cocktail", cocktailSchema);





module.exports = {
  Cocktail //Model
};