/**
 * Routes for users
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const User = require("../models/userModel");
const ActivityModel = require("../models/activityModel")
const Category = require("../models/categoryModel")
const jwt = require("jsonwebtoken");
const EventModel = require("../models/eventModel");

const router = Router();

// Converts seconds to days
const DAY = (days) => {
  return days * 24 * 60 * 60;
};

// Create token for user
const createToken = (id) => {
  return jwt.sign({ id }, "Äldre damer brinner bäst", {
    expiresIn: DAY(3),
  });
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let error = { email: "", password: "" };
  if (err.message === "Wrong password") {
    error.password = "Incorrect password";
  }
  if (err.message === "User does not exist") {
    error.email = "User does not exist";
  }
  if (err.code === 11000) {
    error.email = "Username taken";
    return error;
  }
  if (err.message.includes("user validation failed")) {
    console.log(Object.values(err.errors));
    Object.values(err.errors).forEach(({ properties }) => {
      console.log(properties);
      error[properties.path] = properties.message;
    });
  }
  return error;
};

/**
 * Get all users
 */
router.get("/user", function (req, res) {
  User.find({})
    .populate('city')
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("An error occurred while fetching users.");
    });
});

/**
 * Check availability of user email
 * 200 Available
 * 409 Taken
 */
router.get("/validate/:email", function (req, res) {
  console.log(req.params);
  User.findOne({ email: req.params.email })
    .then((user) => {
      if (user) {
        res.status(409).json({ message: "Email is already taken." });
      } else {
        res.status(200).json({ message: "Email is available." });
      }
    })
    .catch((err) => {
      console.error(err);
    });
});

/**
 * Gets a specific user
 */
router.get('/user/user/:id',authorizeUser, async function (req, res){
    console.log("Vad är detta för skit");
    User.findOne({_id: req.params.id}).then(user=>{
        if (user){
            console.log(user)
            res.status(200).send(user)
        }
        else {
            res.status(505).json({message: "No user found"})
        }
    }).catch(err=>{
        console.error(err)
    });

});

/**
 * Log in as user
 */
router.post("/user/login", async function (req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.login(req.body.email, req.body.password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: DAY(3) * 1000,
      sameSite: "none",
      secure: true,
    });
    res.status(200).send(user._id);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send(errors);
  }
});

router.post("/user/logout", async function (req, res) {
  try {
    res.clearCookie("jwt");
    res.status(200).send({ message: "Logged out successfully" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).send(errors);
  }
});

/**
 * Register new user
 * 201 OK
 * 500 Internal server error
 */
router.post("/user", async (req, res) => {
  try {
    const result = await User.create(req.body);
    const user = await User.login(req.body.email, req.body.password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: DAY(3),
      sameSite: "none",
      secure: true,
    });

    res.status(201).send(result);
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Registration error" });
  }
});

/**
 * Get the matches for a user
 */
router.get("/user/:id/contacts", function (req, res) {
  
});

/**
 * Get the preferences of a user
 */
router.get("/user/:id/preferences", function (req, res) {
  console.log(`Finding user ${req.params.id}`);
  User.findById(req.params.id)
    .populate("preferences")
    .then((user) => {
      res.status(200).send(user.preferences);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

/**
 * Get logged in user profile, based on jwt token.
 */
router.get("/user/profile/me", authorizeUser, async function(req,res) {
  try {
    const user = await User.findById(req.user.id)
        .populate('city')
        .populate("sharedContacts")
        .populate("events")
        .populate({
          path: 'activityData', // Populating activityData
          populate: {
            path: 'activity', // Within each activityData, populate activity
            model: 'activity', // Ensure this matches the name you've used in mongoose.model for your Activity model
            populate: {
              path: 'category', // Within each activity, now populate category
              model: 'category' // Again, ensure this matches the name used in mongoose.model for your Category model
            }
          }
        });

    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }
    user
    res.status(200).send(user);
  } catch (err) {
    console.log(err)
    res.status(500).send('Internal server error');
  }
});

/**
 * Get the interests of a user
 */
router.get("/user/:id/interests", function (req, res) {
  User.findById(req.params.id)
    .populate("interests")
    .then((user) => {
      res.status(200).send(user.interests);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

/**
 * Get the matchdata of a user
 */
router.get("/user/:id/matchdata", function (req, res) {
  User.findById(req.params.id)
    .populate("matchingData")
    .then((user) => {
      res.status(200).send(user.matchingData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500);
    });
});

module.exports = router;
