const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: {
    url: {
      type: String,
      default: "https://media.architecturaldigest.com/photos/57e42deafe422b3e29b7e790/master/pass/JW_LosCabos_2015_MainExterior.jpg",
    },
    filename: {
      type: String,
    },
  },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true },
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;