const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const studentRoutes = require("./routes/studentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const resultRoutes = require("./routes/resultRoutes");


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/students", studentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/applications", require("./routes/applicationRoutes"));
app.use("/api/results", resultRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => app.listen(5000, () => console.log("Server started on port 5000")))
  .catch((err) => console.log(err));