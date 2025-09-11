const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const port = 8080;
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const path = require("path");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));

main()
  .then((res) => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/getsetstay");
}

app.listen(port, (req, res) => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

// app.get("/test", async(req, res) => {
//   let sample = new Listing({
//     title: "my home ",
//     description: "ghar jaisa ghar",
//     price: 1000,
//     country: "India",
//     location: "Varanasi",
//   });

//   await sample.save();
//   console.log("sample was saved");
//   res.send("successful testing");

// });

//index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//new and create route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

app.post(
  "/listings",
  wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }

    //let {title,description,image,price,country,location}=req.body;
    const newListing = new Listing(req.body.listing);
    if (req.body.listing.image) {
      newListing.image = { url: req.body.listing.image };
    }
    await newListing.save();
    res.redirect("/listings");
  })
);

//show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
app.put(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let { image, ...updatedListing } = req.body.listing;
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing");
    }
    if (image) {
      updatedListing.image = { url: image };
    }
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings/${id}`);
  })
);

/* let { title, description, image, price, country, location } = req.body.listing;
await Listing.findByIdAndUpdate(id, {
  title,
  description,
  image: { url: image },
  price,
  country,
  location,
}); */

//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let delListing = await Listing.findByIdAndDelete(id);
    console.log(delListing);
    res.redirect("/listings");
  })
);

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode, message } = err;
  if (!statusCode) statusCode = 500;
  if (!message) message = "Oh No, Something Went Wrong!";
  res.status(statusCode).send(message); // It's better to render an error page
});
