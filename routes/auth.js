// backend/routes/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const nodemailer=require("nodemailer");
require("dotenv").config();

// POST /signup
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, confirmpassword } = req.body;

    // 1) Check if email exists
    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 2) Check passwords match
    if (password !== confirmpassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 3) Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    const mail=nodemailer.createTransport(
      {
        service:"gmail",
        auth:{
          user:process.env.GMAIL,
          pass:process.env.GMAIL_PASSWORD
        }
      }
    )
    const options={
      from:process.env.GMAIL,
      to:email,
      subject:"Thanks for register in our website",
      text:`Hello ${name},Thank you for signing up with  We’re thrilled to have you join our community of movie lovers.`,
    }

    mail.sendMail(options,(err,info)=>{
     if (err) {
        console.error("Email error:", err.message);
      } else {
        console.log("Email sent:", info.response);
      }

    })



    // 4) Save user (no confirmpassword)
    const newUser = new User({
      name,
      email,
      password: hashPassword
    });
    await newUser.save();

    res.status(201).json({ message: "Email registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});


// POST /signin
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Issue JWT
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Signin successful",
      userId: user._id,
      name: user.name,
      token, // ✅ frontend must store this
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;