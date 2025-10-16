import React, { useState, useEffect } from "react";
import { fetchStudents, addStudent, deleteStudent } from "../api/studentApi";
import axios from "axios";

function AdminDashboard() {
  // State for results
  const [results, setResults] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [score, setScore] = useState("");

  // Student form states
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // Course form states
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");

  // Data lists
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);

  // ----------------------------
  // LOADERS
  // ----------------------------
  const loadStudents = async () => {
    const res = await fetchStudents();
    setStudents(res.data);
  };

  const loadCourses = async () => {
    const res = await axios.get("http://localhost:5000/api/courses");
    setCourses(res.data);
  };

  const loadApplications = async () => {
    const res = await axios.get("http://localhost:5000/api/applications");
    setApplications(res.data);
  };

  const loadResults = async () => {
    const res = await axios.get("http://localhost:5000/api/results");
    setResults(res.data);
  };

  useEffect(() => {
    loadStudents();
    loadCourses();
    loadApplications();
    loadResults();
  }, []);

  // ----------------------------
  // STUDENT ACTIONS
  // ----------------------------
  const handleAddStudent = async () => {
    await addStudent({
      name: studentName,
      email: studentEmail,
      password: studentPassword,
    });

    setStudentName("");
    setStudentEmail("");
    setStudentPassword("");

    loadStudents();
  };

  const handleDeleteStudent = async (id) => {
    await deleteStudent(id);
    loadStudents();
  };

  // ----------------------------
  // COURSE ACTIONS
  // ----------------------------
  const handleAddCourse = async () => {
    await axios.post("http://localhost:5000/api/courses", {
      name: courseName,
      description,
    });

    setCourseName("");
    setDescription("");
    loadCourses();
  };

  // ----------------------------
  // RESULT ACTIONS
  // ----------------------------
  const handleAddResult = async () => {
    if (!selectedStudent || !selectedCourse || !score) {
      alert("Please fill all fields before adding a result");
      return;
    }

    await axios.post("http://localhost:5000/api/results", {
      studentId: selectedStudent,
      courseId: selectedCourse,
      score: Number(score),
    });

    setSelectedStudent("");
    setSelectedCourse("");
    setScore("");
    loadResults();
  };

  // ----------------------------
  // APPLICATION ACTIONS
  // ----------------------------
  const handleApprove = async (courseId, applicationId) => {
    await axios.put(
      `http://localhost:5000/api/applications/${courseId}/${applicationId}/approve`
    );
    loadApplications();
  };

  // ----------------------------
  // LOGOUT
  // ----------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>
        Admin Dashboard <button onClick={handleLogout}>Logout</button>
      </h1>

      {/* -------------------- */}
      {/* ADD STUDENT SECTION */}
      {/* -------------------- */}
      <h2>Add Student</h2>
      <input
        placeholder="Name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
        autoComplete="off"
      />
      <input
        placeholder="Email"
        value={studentEmail}
        onChange={(e) => setStudentEmail(e.target.value)}
        autoComplete="new-email"
      />
      <input
        placeholder="Password"
        type="password"
        value={studentPassword}
        onChange={(e) => setStudentPassword(e.target.value)}
        autoComplete="new-password"
      />
      <button onClick={handleAddStudent}>Add Student</button>

      <h2>Student List</h2>
      <ul>
        {students.map((s) => (
          <li key={s._id}>
            {s.name} ({s.email})
            <button onClick={() => handleDeleteStudent(s._id)}>Delete</button>
          </li>
        ))}
      </ul>

      {/* -------------------- */}
      {/* COURSES SECTION */}
      {/* -------------------- */}
      <h2>Add Course</h2>
      <input
        placeholder="Course Name"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleAddCourse}>Add Course</button>

      <ul>
        {courses.map((course) => (
          <li key={course._id}>
            {course.name} - {course.description}
          </li>
        ))}
      </ul>

      {/* -------------------- */}
      {/* ADD RESULT SECTION */}
      {/* -------------------- */}
      <h2>Add Student Result</h2>
      <select
        value={selectedStudent}
        onChange={(e) => setSelectedStudent(e.target.value)}
      >
        <option value="">Select Student</option>
        {students.map((s) => (
          <option key={s._id} value={s._id}>
            {s.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Score"
        value={score}
        onChange={(e) => setScore(e.target.value)}
      />
      <button onClick={handleAddResult}>Add Result</button>

     {/* -------------------- */}
{/* ALL RESULTS */}
{/* -------------------- */}
<h2>All Results</h2>
<ul>
  {results.length === 0 ? (
    <p>No results yet.</p>
  ) : (
    results.map((r) => (
      <li key={r._id}>
        {r.student.name} — {r.course.name}: {r.score} points
        {" "} | Stanine: <strong>{r.stanine}</strong>
        {" "} ({r.gradeDescription})
      </li>
    ))
  )}
</ul>

      {/* -------------------- */}
      {/* APPLICATIONS */}
      {/* -------------------- */}
      <h2>Pending Course Applications</h2>
      <ul>
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map((app) => (
            <li key={`${app.courseId}-${app.applicationId}`}>
              Student: {app.student.name} — Course: {app.courseName}
              <button
                onClick={() =>
                  handleApprove(app.courseId, app.applicationId)
                }
              >
                Approve
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default AdminDashboard;
