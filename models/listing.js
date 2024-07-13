const mongoose = require("mongoose");
const review = require("./review");
const { ref, required, string } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: {
    url: String,
    filename : String,

  }, //default image link if there is no any image upaded
  price: Number,
  location: String,
  country: String,
  reviews : [
    {
      type: Schema.Types.ObjectId, 
      ref : "Review" 
    }
  ],
  owner : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
//   category : {
//     type : String,
//     enum : [
//       "Rooms",
// "Iconic Cities",
// "Amazing pools",
// "Castles",
// "Camping",
// "Beaches",
// "Mountain",
// "Tree Houses",
// "Farms",
// "Arctic",]
//   }
  },
);


listingSchema.post("findOneAndDelete",async(listing) => {
  if(listing) {
    await review.deleteMany({_id : {$in: listing.reviews}})
  }

})


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
