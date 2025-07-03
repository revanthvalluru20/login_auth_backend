const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const user = new User({ name, email, password: hashed, otp, otpExpires: Date.now() + 5 * 60 * 1000 });
    await user.save();

    await sendEmail(email, "Verify OTP", `<p>Your OTP is <b>${otp}</b></p>`);
    res.json({ msg: "OTP sent to email" });
});

module.exports = router;
