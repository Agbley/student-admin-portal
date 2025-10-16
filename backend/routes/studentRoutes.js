const express = require("express");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post("/register", async (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const student = new Student({ ...req.body, password: hashedPassword });
  await student.save();
  res.status(201).json(student);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const student = await Student.findOne({ email });
  if (!student || !bcrypt.compareSync(password, student.password)) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

// POST /api/students — Admin-only create student
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check for existing student
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Student already exists" });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);
    const student = new Student({ name, email, password: hashedPassword });
    await student.save();

    res.status(201).json(student);
  } catch (err) {
    console.error("Add student error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

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

// GET /api/students/me – return student profile with courses
router.get("/me", authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.studentId).populate("courses");
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.json(student);
  } catch (err) {
    console.error("Fetch student error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/students/:id — Admin-only delete student
router.delete("/:id", async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Delete student error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;