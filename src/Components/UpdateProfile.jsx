import React, { useState, useEffect } from "react";
import { Typography, TextField, Box } from "@mui/material";
import fetchWithAuth from "../utils/api"; // make sure to replace with actual utility function
import Button from "@mui/material/Button";
function UpdateProfile({ onBack }) {
  const [profile, setProfile] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    address: "",
    phone_number: "",
    drivers_license_number: "",
    birthday: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState({
    firstname: false,
    lastname: false,
    username: false,
    email: false,
    password: false,
    address: false,
    phone_number: false,
    drivers_license_number: false,
    birthday: false,
    gender: false,
    confirmPassword: false,
  });

  useEffect(() => {
    // Fetch the current user's data using the token from localStorage
    const fetchUserData = async () => {
      try {
        const response = await fetchWithAuth(
          "http://localhost:3000/routes/current-user/",
          {
            method: "GET",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setProfile({
            firstname: data.firstname || "",
            lastname: data.lastname || "",
            username: data.username || "",
            email: data.email || "",
            address: data.address || "",
            phone_number: data.phone_number || "",
            drivers_license_number: data.drivers_license_number || "",
            birthday: data.birthday || "",
            gender: data.gender || "",
          });
        } else {
          throw new Error("Could not fetch user data");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleEditClick = (userId) => {
    setIsEditing({ ...isEditing, [userId]: true });
  };

  const handleSaveClick = async (userId) => {
    // Add logic to validate input if necessary, e.g., check if username already exists
    // Then send update to the server
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/routes/update-profile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [userId]: profile[userId] }),
        }
      );
      if (!response.ok) {
        throw new Error("Could not update user data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsEditing({ ...isEditing, [userId]: false });
  };

  const handleChange = (event) => {
    setProfile({ ...profile, [event.target.name]: event.target.value });
  };

  const fieldDisplay = (userId, type = "text") => {
    let value = profile[userId];

    // Format date for date input fields
    if (type === "date" && value) {
      const date = new Date(value);
      // Format the date to YYYY-MM-DD
      value = date.toISOString().split("T")[0];
    }

    return isEditing[userId] ? (
      <TextField
        name={userId}
        value={value}
        onChange={handleChange}
        onBlur={() => handleSaveClick(userId)}
        type={type}
        fullWidth
        variant="outlined"
        size="small"
        autoFocus
      />
    ) : (
      <Typography
        onClick={() => handleEditClick(userId)}
        style={{ cursor: "pointer", borderBottom: "1px dashed lightgrey" }}
      >
        {profile[userId] || "Click to add"}
      </Typography>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Button variant="outlined" onClick={onBack} sx={{ marginBottom: 2 }}>
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="overline">First Name</Typography>
          {fieldDisplay("firstname")}
        </Box>
        <Box>
          <Typography variant="overline">Last Name</Typography>
          {fieldDisplay("lastname")}
        </Box>
        <Box>
          <Typography variant="overline">Address</Typography>
          {fieldDisplay("address")}
        </Box>
        <Box>
          <Typography variant="overline">Phone Number</Typography>
          {fieldDisplay("phone_number")}
        </Box>
        <Box>
          <Typography variant="overline">Driver's License Number</Typography>
          {fieldDisplay("drivers_license_number")}
        </Box>
        <Box>
          <Typography variant="overline">Birthday</Typography>
          {fieldDisplay("birthday", "date")}
        </Box>
        <Box>
          <Typography variant="overline">Email</Typography>
          {fieldDisplay("email")}
        </Box>
      </Box>
    </Box>
  );
}
export default UpdateProfile;
