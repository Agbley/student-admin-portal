import React, { useEffect, useState } from "react";
import axios from "axios";

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [results, setResults] = useState([]); // 🆕
  const token = localStorage.getItem("token");

  // -------------------------------
  // FETCH STUDENT INFO
  // -------------------------------
  const fetchStudent = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/students/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudent(res.data);
    } catch (err) {
      console.error("Error fetching student:", err);
    }
  };

  // -------------------------------
  // FETCH COURSES
  // -------------------------------
  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  // -------------------------------
  // FETCH RESULTS (🆕)
  // -------------------------------
  const fetchResults = async (studentId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/results/student/${studentId}`
      );
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  // -------------------------------
  // APPLY TO COURSE
  // -------------------------------
  const applyToCourse = async (courseId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/courses/${courseId}/apply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted");
      fetchCourses();
    } catch (err) {
      alert(err.response?.data?.message || "Application failed");
    }
  };

  // -------------------------------
  // LOGOUT
  // -------------------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // -------------------------------
  // USE EFFECT
  // -------------------------------
  useEffect(() => {
    fetchStudent();
    fetchCourses();
  }, []);

  // Once student is loaded, fetch their results
  useEffect(() => {
    if (student?._id) {
      fetchResults(student._id);
    }
  }, [student]);

  // -------------------------------
  // UI RENDER
  // -------------------------------
  if (!student) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome, {student.name}!</h1>
      <p>Email: {student.email}</p>

      {/* -------------------- */}
      {/* ENROLLED COURSES */}
      {/* -------------------- */}
      <h2>Enrolled Courses</h2>
      {student.courses.length === 0 ? (
        <p>No courses enrolled.</p>
      ) : (
        <ul>
          {student.courses.map((course) => (
            <li key={course._id}>
              <strong>{course.name}</strong>: {course.description}
            </li>
          ))}
        </ul>
      )}

      {/* -------------------- */}
      {/* AVAILABLE COURSES */}
      {/* -------------------- */}
      <h2>Available Courses</h2>
      {courses.map((course) => {
        const myApplication = course.applications?.find(
          (a) => a.student && a.student._id === student._id
        );

        return (
          <div
            key={course._id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <h4>{course.name}</h4>
            <p>{course.description}</p>
            {myApplication ? (
              <p>Status: {myApplication.status}</p>
            ) : (
              <button onClick={() => applyToCourse(course._id)}>Apply</button>
            )}
          </div>
        );
      })}

      {/* -------------------- */}
{/* STUDENT RESULTS (🆕) */}
{/* -------------------- */}
<h2>Your Results</h2>
{results.length === 0 ? (
  <p>No results yet.</p>
) : (
  <ul>
    {results.map((r) => (
      <li key={r._id}>
        <strong>{r.course.name}</strong>: {r.score} points
        {" "} | Stanine: <strong>{r.stanine}</strong>
        {" "} ({r.gradeDescription})
      </li>
    ))}
  </ul>
)}


      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default StudentDashboard;
