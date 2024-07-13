const express = require("express");
const router = express.Router({mergeParams:true}); // to merge parent link from app.js 
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/ExpressError.js")
const Review = require("../models/review.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js"); 
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js")
const reviewController = require("../controllers/reviews.js")

//Reviews
//Post Route
router.post("/", isLoggedIn ,validateReview,wrapAsync(reviewController.createReview))
  
  
  //Delete Review Route
  router.delete("/:reviewId", isLoggedIn , isReviewAuthor ,wrapAsync(reviewController.destroyReview))

   
  router.all("*",(req,res,next) => {
    next(new ExpressError(404,"page not found!"))
  }) 
  
 

 

  module.exports = router
