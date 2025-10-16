// 📁 backend/routes/applicationRoutes.js

const express = require("express");
const Course = require("../models/Course");
const Student = require("../models/Student");
const router = express.Router();

// GET /api/applications
// Returns all pending applications across all courses
router.get("/", async (req, res) => {
  try {
    // Populate each application’s student info
    const courses = await Course.find()
      .populate("applications.student", "name email");

    // Flatten and filter to pending only
    const applications = [];
    courses.forEach(course => {
      course.applications.forEach(app => {
        if (app.status === "pending") {
          applications.push({
            courseId: course._id,
            courseName: course.name,
            applicationId: app._id,
            student: app.student,
            status: app.status
          });
        }
      });
    });

    res.json(applications);
  } catch (err) {
    console.error("Error loading applications:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/applications/:courseId/:applicationId/approve
// Approve a student’s application and add the course to the student’s enrolled list
router.put("/:courseId/:applicationId/approve", async (req, res) => {
  try {
    const { courseId, applicationId } = req.params;
    const course = await Course.findById(courseId);
    const app = course.applications.id(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "approved";
    await course.save();

    // Add the course to the student's courses array
    await Student.findByIdAndUpdate(app.student, {
      $addToSet: { courses: courseId }
    });

    res.json({ message: "Application approved" });
  } catch (err) {
    console.error("Error approving application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/applications/:courseId/:applicationId/reject
// Reject a student’s application
router.put("/:courseId/:applicationId/reject", async (req, res) => {
  try {
    const { courseId, applicationId } = req.params;
    const course = await Course.findById(courseId);
    const app = course.applications.id(applicationId);
    if (!app) return res.status(404).json({ message: "Application not found" });

    app.status = "rejected";
    await course.save();

    res.json({ message: "Application rejected" });
  } catch (err) {
    console.error("Error rejecting application:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
