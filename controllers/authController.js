const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const user = new User({ name, email, password: hashed, otp, otpExpires: Date.now() + 5 * 60 * 1000 });
    await user.save();

    await sendEmail(email, "Verify OTP", `<p>Your OTP is <b>${otp}</b></p>`);
    res.json({ msg: "OTP sent to email" });
    };

    exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !user.verified) return res.status(400).json({ msg: "Invalid email or not verified" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET);
    res.json({ token, name: user.name });
};
