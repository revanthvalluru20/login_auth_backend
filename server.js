const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB(); // connect to MongoDB

// Mount all routes
app.use("/api/auth", require("./routes/registerRoute"));
app.use("/api/auth", require("./routes/verifyOtpRoute"));
app.use("/api/auth", require("./routes/loginRoute"));
app.use("/api/auth", require("./routes/sendOtpRoute"));
app.use("/api/auth", require("./routes/forgotPasswordRoute"));
app.use("/api/auth", require("./routes/changePasswordRoute"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
