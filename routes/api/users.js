const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require("express-validator");

// Import User model
const User = require("../../models/User");

// @route   POST api/users
// @desc    Test route
// @access  Public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    console.log(req.body);
    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({
        email,
      });

      if (user) {
        return res.status(400).json({
          errors: [
            {
              msg: "User already exists",
            },
          ],
        });
      }
      // Get users gravatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      // Create new user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user
      await user.save();

      const payload = {
        id: user.id
      }

      // @TODO: Before production set expiresIn to 3600
      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn : 360000 },
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      // 500 is server error
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
