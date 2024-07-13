const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  let listing = await Listing.findById(req.params.id)
  let newReview = new Review(req.body.review)
  newReview.author = req.user._id
  listing.reviews.push(newReview)

  await newReview.save().then(res => console.log(res)).catch(err => console.log(err))
  await listing.save().then(res => console.log(res)).catch(err => console.log(err))
  req.flash("success", "New review created")

  res.redirect(`/listings/${listing._id}`)
}


module.exports.destroyReview = async (req, res) => {
  const { id, reviewId } = req.params
  // console.log(id, reviewId) 
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
  await Review.findByIdAndDelete(reviewId)
  req.flash("success", "Review Deleted")
  res.redirect("/listings")
}