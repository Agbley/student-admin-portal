const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  applications: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
    }
  ]
});

module.exports = mongoose.model("Course", courseSchema);
