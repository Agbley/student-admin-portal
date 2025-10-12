const express = require("express");
const Course = require("../models/Course");
const Student = require("../models/Student");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to authenticate student
const authenticateStudent = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.studentId = decoded.id;
    next();
  } catch {
    res.status(403).json({ message: "Invalid token" });
  }
};

// ADMIN: Create Course
router.post("/", async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.status(201).json(course);
});

// STUDENT: View all courses
router.get("/", async (req, res) => {
  const courses = await Course.find().populate("applications.student", "name email");
  res.json(courses);
});

// STUDENT: Apply to a course
router.post("/:courseId/apply", authenticateStudent, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

  const alreadyApplied = course.applications.some(
    (app) => app.student.toString() === req.studentId
  );
  if (alreadyApplied) return res.status(400).json({ message: "Already applied" });

  course.applications.push({ student: req.studentId });
  await course.save();

  res.json({ message: "Application submitted" });
});

// ADMIN: Approve application
router.post("/:courseId/applications/:studentId/approve", async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  const app = course.applications.find(
    (a) => a.student.toString() === req.params.studentId
  );
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status = "approved";
  await course.save();

  // Optionally, add course to student's enrolled list
  await Student.findByIdAndUpdate(req.params.studentId, {
    $addToSet: { courses: course._id }
  });

  res.json({ message: "Application approved" });
});

// ADMIN: Reject application
router.post("/:courseId/applications/:studentId/reject", async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  const app = course.applications.find(
    (a) => a.student.toString() === req.params.studentId
  );
  if (!app) return res.status(404).json({ message: "Application not found" });

  app.status = "rejected";
  await course.save();

  res.json({ message: "Application rejected" });
});

module.exports = router;
