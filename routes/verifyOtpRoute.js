const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.post("/verify-otp", async (req, res) => {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
        return res.status(400).json({ msg: "Invalid or expired OTP" });
    }
    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.json({ msg: "Email verified, proceed to login" });
});

module.exports = router;
