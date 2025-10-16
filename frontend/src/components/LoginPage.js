import React, { useState } from "react";
import { loginAdmin, loginStudent } from "../api/studentApi";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogin = async () => {
    try {
      if (isAdmin) {
        const res = await loginAdmin({ username: email, password });
        localStorage.setItem("token", res.data.token);
        window.location.href = "/admin";
      } else {
        const res = await loginStudent({ email, password });
        localStorage.setItem("token", res.data.token);
        window.location.href = "/student";
      }
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>{isAdmin ? "Admin Login" : "Student Login"}</h2>
      <input placeholder="Email/Username" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <label>
        <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} /> Login as Admin
      </label>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;