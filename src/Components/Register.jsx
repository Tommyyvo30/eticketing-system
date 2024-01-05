import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";
import fetchWithAuth from "../utils/api";
function Register({ onToggle }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    driversLicenseNumber: "",
    address: "",
    gender: "",
    birthday: "",
    role: "user",
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Create a new object with the necessary data, including the default role
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
        email: formData.email,
        role: "user",
        phone_number: formData.phoneNumber,
        drivers_license_number: formData.driversLicenseNumber,
        address: formData.address,
        gender: formData.gender,
        birthday: formData.birthday,
      };

      const response = await fetchWithAuth(
        "http://localhost:3000/routes/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.token); // Store token

      navigate("/login"); // Redirect to login after successful registration
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleBack = () => {
    navigate("/login");
  };

  return (
    <div
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f7f7f7", // Soft background color
      }}
    >
      <Button
        onClick={handleBack}
        variant="text"
        color="primary"
        sx={{
          position: "absolute",
          top: "16px",
          left: "1px",
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
          fontFamily: "Courier New, monospace",
          fontWeight: "bold",
        }}
      >
        Register
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
      >
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="first-name-input">First Name</InputLabel>
          <Input
            id="first-name-input"
            name="firstName"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="last-name-input">Last Name</InputLabel>
          <Input
            id="last-name-input"
            name="lastName"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="username-input">Username</InputLabel>
          <Input
            id="username-input"
            name="username"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="password-input">Password</InputLabel>
          <Input
            id="password-input"
            name="password"
            type="password"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="email-input">Email</InputLabel>
          <Input
            id="email-input"
            name="email"
            type="email"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="phone-input">Phone Number</InputLabel>
          <Input
            id="phone-input"
            name="phoneNumber"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="license-input">
            Driver's License Number
          </InputLabel>
          <Input
            id="license-input"
            name="driversLicenseNumber"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="address-input">Address</InputLabel>
          <Input
            id="address-input"
            name="address"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <InputLabel htmlFor="gender-input">Gender</InputLabel>
          <Input
            id="gender-input"
            name="gender"
            disableUnderline
            onChange={handleChange}
            required
          />
        </FormControl>
        <FormControl fullWidth margin="dense">
          <TextField
            id="birthday-input"
            label="Birthday"
            type="date"
            InputLabelProps={{
              shrink: true, // This ensures the label doesn't overlap with the input text
            }}
            name="birthday"
            variant="outlined" // This gives the TextField an outlined look
            onChange={handleChange}
            required
            sx={{
              ".MuiInputBase-input": {
                height: "1.4375em", // Adjust the height if necessary
                // Add any additional styles you need here
              },
            }}
          />
        </FormControl>

        <Button
          type="submit"
          variant="outlined"
          color="primary"
          fullWidth
          sx={{
            marginTop: "20px",
            backgroundColor: "#4caf50", // Green color
            ":hover": {
              backgroundColor: "#45a049", // Darker green on hover
            },
            color: "White",
          }}
        >
          Register
        </Button>
        <Button
          onClick={onToggle}
          sx={{ textTransform: "none", marginTop: "8px", color: "#2196f3" }}
        >
          Back to Login
        </Button>
      </Box>
    </div>
  );
}

export default Register;
