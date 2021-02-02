const express = require("express");
const router = express.Router();

//bring in accommodation models
let Accommodation = require("../models/accommodation");

//bring in user models
let User = require("../models/user");

// add route
router.get("/add", ensureAuthenticated, function (req, res) {
  res.render("add_accommodation", {
    name: "Add Accommodation",
  });
});

//add Submit POST route
router.post("/add", function (req, res) {
  //validator
  req.checkBody("name", "name is required").notEmpty();
  // req.checkBody('author', 'Author is required').notEmpty();
  req.checkBody("telephone", "telephone is required").notEmpty();
  req.checkBody("accEmail", "Email is required").notEmpty();
  req.checkBody("address", "Address is required").notEmpty();
  req.checkBody("time", "Time to campus is required").notEmpty();
  req.checkBody("singlePrice", "Single Room Price is required").notEmpty();
  req.checkBody("sharingPrice", "Sharing room Price is required").notEmpty();
  // req.checkBody("nsfas", "Body is required").notEmpty();
  // req.checkBody("card", "Body is required").notEmpty();
  // req.checkBody("cash", "Body is required").notEmpty();
  req.checkBody("male", "Male Available rooms is required").notEmpty();
  req.checkBody("female", "Female Available rooms is required").notEmpty();

  //Get validation Errors
  let errors = req.validationErrors();

  if (errors) {
    res.render("add_accommodation", {
      name: "Add Accommodation",
      errors: errors,
    });
  } else {
    let accommodation = new Accommodation();
    accommodation.name = req.body.name;
    accommodation.author = req.user._id;
    accommodation.telephone = req.body.telephone;
    accommodation.accEmail = req.body.accEmail;
    accommodation.address = req.body.address;
    accommodation.time = req.body.time;
    //accommodation prices
    accommodation.singlePrice = req.body.singlePrice;
    accommodation.sharingPrice = req.body.sharingPrice;
    //payment options
    accommodation.nsfas = req.body.nsfas;
    accommodation.card = req.body.card;
    accommodation.cash = req.body.cash;
    //available rooms
    accommodation.male = req.body.male;
    accommodation.female = req.body.female;

    accommodation.save(function (err) {
      if (err) {
        console.log(err);
        return;
      } else {
        req.flash("success", "Accommodation Added");
        res.redirect("/");
      }
    });
  }
});

//Load edit from
router.get("/edit/:id", ensureAuthenticated, function (req, res) {
  Accommodation.findById(req.params.id, function (err, accommodation) {
    if (accommodation.author != req.user._id) {
      req.flash("danger", "Not Authorized");
      res.redirect("/");
    }
    res.render("edit_accommodation", {
      name: "Edit Accommodation",
      accommodation: accommodation,
    });
  });
});

//update Submit POST route
router.post("/edit/:id", function (req, res) {
  let accommodation = {};
  accommodation.name = req.body.name;
  accommodation.telephone = req.body.telephone;
  accommodation.accEmail = req.body.accEmail;
  accommodation.address = req.body.address;
  accommodation.time = req.body.time;
  //accommodation prices
  accommodation.singlePrice = req.body.singlePrice;
  accommodation.sharingPrice = req.body.sharingPrice;
  //payment options
  accommodation.nsfas = req.body.nsfas;
  accommodation.card = req.body.card;
  accommodation.cash = req.body.cash;
  //available rooms
  accommodation.male = req.body.male;
  accommodation.female = req.body.female;

  let query = { _id: req.params.id };

  Accommodation.update(query, accommodation, function (err) {
    if (err) {
      console.log(err);
      return;
    } else {
      req.flash("success", "Accommodation updated");
      res.redirect("/");
    }
  });
});

//delete accommodation
router.delete("/:id", function (req, res) {
  if (!req.user._id) {
    res.status(500).send();
  }
  let query = { _id: req.params.id };

  Accommodation.findById(req.params.id, function (err, accommodation) {
    if (accommodation.author != req.user._id) {
      res.status(500).send();
    } else {
      Accommodation.remove(query, function (err) {
        if (err) {
          console.log(err);
        }
        res.send("success");
      });
    }
  });
});

//get single accommodation
router.get("/:id", function (req, res) {
  Accommodation.findById(req.params.id, function (err, accommodation) {
    User.findById(accommodation.author, function (err, user) {
      res.render("accommodation", {
        accommodation: accommodation,
        author: user.name,
      });
    });
  });
});

//Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "Please Log in");
    res.redirect("/users/login");
  }
}

module.exports = router;
