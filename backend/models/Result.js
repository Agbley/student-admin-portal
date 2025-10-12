const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  score: { type: Number, required: true },
  grade: { type: String },
}, { timestamps: true });

// Auto-calculate grade before saving
resultSchema.pre("save", function (next) {
  const score = this.score;
  if (score >= 80) this.grade = "A";
  else if (score >= 70) this.grade = "B";
  else if (score >= 60) this.grade = "C";
  else if (score >= 50) this.grade = "D";
  else this.grade = "F";
  next();
});

module.exports = mongoose.model("Result", resultSchema);
