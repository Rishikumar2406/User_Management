const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  gender: { type: String },
  status: { type: String, default: "Active" },
  location: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
