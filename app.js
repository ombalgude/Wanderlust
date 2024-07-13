if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
console.log(process.env.SECRET) 

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); // direct file require
const ExpressError = require("./utils/ExpressError.js");
const { error } = require("console");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { date } = require("joi");
const flash = require("connect-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const atlasdb_Url = process.env.ATLASDB_URL

main()
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(atlasdb_Url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


const store = MongoStore.create({
  mongoUrl: atlasdb_Url,
  crypto:{
     secret : process.env.SECRET
  },
  touchAfter: 24*3600,

})

store.on("error" , () => {
  console.log("ERROR IN MONGO SESSION STORE", err)
})

const sessionOptions = {
  store : store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires : Date.now() + 7 * 24 * 60 * 60 *1000 ,
    maxAge : 7 * 24 * 60 * 60 *1000 ,
    httpOnly : true
  }
}

// app.get("/", (req, res) => {
//   res.send("hi i am  root ");
// });npm install connect-mongo



app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user
  next()
})


// app.get("/demouser" , async (req,res) => {
//   let fakeUser = new User({
//     email : "student@gmail.com",
//     username : "delta-student"
//   }) 

//   let regieteredUser = await User.register(fakeUser , "helloworld")
//   res.send(regieteredUser)
// })


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter) //"reviewRouter & listingRouter" these words are use for requiring the file from route folder soo chack it upward for that

// MIDDLEWARE FOR CUSTOM ERROR HANDLING
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Someting went wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
  // res.status(statusCode).send(message)
});

app.listen(8080, () => {
  console.log("server listing on port 8080");
});



 