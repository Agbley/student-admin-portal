const express = require("express");
const Result = require("../models/Result");
const Student = require("../models/Student");
const Course = require("../models/Course");
const router = express.Router();

// ✅ Admin: Add a result for a student
router.post("/", async (req, res) => {
  try {
    const { studentId, courseId, score } = req.body;

    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) {
      return res.status(404).json({ message: "Student or Course not found" });
    }

    const result = new Result({ student: studentId, course: courseId, score });
    await result.save();

    res.status(201).json(result);
  } catch (err) {
    console.error("Add result error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Admin: Get all results
router.get("/", async (req, res) => {
  const results = await Result.find()
    .populate("student", "name email")
    .populate("course", "name");
  res.json(results);
});

// ✅ Student: Get results for logged-in student
router.get("/student/:id", async (req, res) => {
  const results = await Result.find({ student: req.params.id })
    .populate("course", "name");
  res.json(results);
});

module.exports = router;
