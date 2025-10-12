const express = require("express");
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const Course = require("../models/Course");
const Student = require("../models/Student");

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});



// GET all applications across courses
router.get("/applications", async (req, res) => {
  try {
    const courses = await Course.find().populate("applications.student");
    const applications = [];

    courses.forEach(course => {
      course.applications.forEach(app => {
        applications.push({
          courseId: course._id,
          courseName: course.name,
          courseDescription: course.description,
          applicationId: app._id,
          student: app.student,
          status: app.status
        });
      });
    });

    res.json(applications);
  } catch (err) {
    console.error("Error loading applications:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT to approve an application
router.put("/applications/:courseId/:applicationId/approve", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const application = course.applications.id(req.params.applicationId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = "approved";
    await course.save();

    res.json({ message: "Application approved" });
  } catch (err) {
    console.error("Error approving application:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;