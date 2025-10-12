// createAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const username = "admin123";
  const password = "adminpass";

  const hashed = bcrypt.hashSync(password, 8);
  const admin = new Admin({ username, password: hashed });

  await admin.save();
  console.log("Admin created successfully!");
  mongoose.disconnect();
});
