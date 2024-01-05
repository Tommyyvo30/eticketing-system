import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import HomePage from "./Components/HomePage.jsx";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Header from "./Components/Header.jsx";
import Footer from "./Components/Footer.jsx";
import AboutUs from "./Components/About.jsx";
import Contact from "./Components/Contact.jsx";
import FAQ from "./Components/FAQ.jsx";
import PayTicket from "./Components/PayTicket.jsx";
import "./Styles/App.css";

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const toggleLoginRegister = () => setIsLogin(!isLogin);

  return (
    <div className="form">
      {isLogin ? (
        <Login onLogin={onLogin} onToggle={toggleLoginRegister} />
      ) : (
        <Register onToggle={toggleLoginRegister} />
      )}
    </div>
  );
}
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("token") ? true : false
  );
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  const handleLogin = (role, token) => {
    localStorage.setItem("token", token); // Store the JWT token
    localStorage.setItem("role", role); // Store the role
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the JWT token
    setIsLoggedIn(false);
    setUserRole("");
  };

  return (
    <Router>
      <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage onLogin={handleLogin} />} />
        {isLoggedIn && (
          <Route
            path="/dashboard"
            element={<Dashboard role={userRole} onLogout={handleLogout} />}
          />
        )}
        <Route path="/about" element={<AboutUs isLoggedIn={isLoggedIn} />} />
        <Route path="/contact" element={<Contact isLoggedIn={isLoggedIn} />} />
        <Route path="/faq" element={<FAQ isLoggedIn={isLoggedIn} />} />
        <Route path="/payticket" element={<PayTicket />} />
        {/* Redirect to home if no match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
