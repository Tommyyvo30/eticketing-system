import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import fetchWithAuth from "../utils/api";
function Login({ onLogin, onToggle }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithAuth(
        "http://localhost:3000/routes/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("userId", data.userId); // Store the user ID
        onLogin(data.role, data.token);
        navigate("/dashboard");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7",
      }}
    >
      <Button
        onClick={handleBack}
        variant="text"
        color="primary"
        sx={{
          position: "relative",
          top: "30px",
          left: "-150px",
          alignSelf: "flex-start",
        }}
      >
        <ArrowBackIcon />
      </Button>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          color: "#4caf50",
          marginBottom: "20px",
          marginLeft: "20px",
          fontFamily: "Courier New, monospace",
          fontWeight: "bold",
        }}
      >
        Welcome Back!
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="username-input" sx={{ textAlign: "center" }}>
            Username or Email
          </InputLabel>
          <Input
            id="username-input"
            name="username"
            disableUnderline
            onChange={handleChange}
            required
            sx={{ textAlign: "center" }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="password-input" sx={{ textAlign: "center" }}>
            Password
          </InputLabel>
          <Input
            id="password-input"
            name="password"
            type="password"
            disableUnderline
            onChange={handleChange}
            required
            sx={{ textAlign: "center" }}
          />
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            marginTop: "20px",
            backgroundColor: "#4caf50", // Green color
            ":hover": {
              backgroundColor: "#45a049", // Darker green on hover
            },
          }}
        >
          Sign In
        </Button>
      </form>
      <Typography
        variant="body2"
        sx={{ marginTop: "20px", textAlign: "center" }}
      >
        Don't have an account?{" "}
        <Link onClick={onToggle} sx={{ cursor: "pointer", color: "#2196f3" }}>
          Sign Up
        </Link>
      </Typography>
    </div>
  );
}

export default Login;
