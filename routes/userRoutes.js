const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { jwtAuthMiddleware, generateToken } = require("./../jwt");

router.post("/signup", async (req, res) => {
  try {
    const data = req.body; //Assuming the request body contains the person data

    //Create a new User document using the Mongoose model
    const newUser = new User(data);

    //save the new User to the database
    const response = await newUser.save();
    console.log("data saved");

    const payload = {
      id: response.id,
    };

    const token = generateToken(payload);
    console.log("Token is:", token);

    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error" });
  }
});

//Login Route
router.post("/login", async (req, res) => {
  try {
    //extract aadharCardNumber and password from request body
    const { aadharCardNumber, password } = req.body;
    //find the user by username
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    //generate token
    const payload = {
      id: user.id,
    };

    const token = generateToken(payload);

    //return token as response
    res.json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error" });
  }
});

//profile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const userData = req.user;
    const userId = userData.id;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error" });
  }
});

//updating data

router.put("/:profile/password", jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id; //extract the id from token
    const { currentPassword, newPassword } = req.body;

    //find the user by userId
    const user = await User.findById(userId);

    //if password not match return error
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // update the user's password
    user.password = newPassword;
    await user.save();
   


    console.log("password updated");
    res.status(200).json({message:"password updated"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server Error" });
  }
});

module.exports = router;
