const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    score: { type: Number, required: true },
    stanine: { type: Number },
    gradeDescription: { type: String },
  },
  { timestamps: true }
);

// 🧮 Stanine calculation (1 = highest, 9 = lowest)
resultSchema.pre("save", function (next) {
  const score = this.score;
  let stanine = 9;
  let desc = "Lowest";

  if (score >= 85) {
    stanine = 1;
    desc = "Excellent";
  } else if (score >= 75) {
    stanine = 2;
    desc = "Very Good";
  } else if (score >= 65) {
    stanine = 3;
    desc = "Good";
  } else if (score >= 55) {
    stanine = 4;
    desc = "Fairly Good";
  } else if (score >= 45) {
    stanine = 5;
    desc = "Average";
  } else if (score >= 35) {
    stanine = 6;
    desc = "Below Average";
  } else if (score >= 25) {
    stanine = 7;
    desc = "Weak";
  } else if (score >= 15) {
    stanine = 8;
    desc = "Very Weak";
  } else {
    stanine = 9;
    desc = "Lowest";
  }

  this.stanine = stanine;
  this.gradeDescription = desc;
  next();
});

module.exports = mongoose.model("Result", resultSchema);
