import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import fetchWithAuth from "../utils/api"; // Update the import path as needed

function CreateTicket({ onTicketCreated, onBack }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    officer_name: "",
    violation: "",
    details: "",
    license_plate: "",
    assigned_user_id: "",
    address: "",
    drivers_license: "",
    amount_due: "",
  });

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithAuth(
        "http://localhost:3000/routes/create-ticket",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      onTicketCreated();
    } catch (error) {
      console.error("Error:", error.message);
    }
    navigate("/dashboard");
  };

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchWithAuth("http://localhost:3000/routes/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const formFieldStyles = {
    my: 1,
  };

  return (
    <Paper
      sx={{
        padding: "20px",
        margin: "20px",
        textAlign: "center",
        boxShadow: "none",
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: "10px" }}
        onClick={onBack}
      >
        &larr; Back
      </Button>
      <Typography variant="h5" gutterBottom>
        Create Ticket
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Officer Name"
          variant="outlined"
          fullWidth
          name="officer_name"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <TextField
          label="Violation"
          variant="outlined"
          fullWidth
          name="violation"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <TextField
          label="Details"
          variant="outlined"
          fullWidth
          name="details"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <TextField
          label="Amount Due"
          variant="outlined"
          fullWidth
          name="amount_due"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <TextField
          label="License Plate"
          variant="outlined"
          fullWidth
          name="license_plate"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <TextField
          label="Address"
          variant="outlined"
          fullWidth
          name="address"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <TextField
          label="Driver's License Number"
          variant="outlined"
          fullWidth
          name="drivers_license"
          onChange={handleChange}
          required
          sx={formFieldStyles}
        />
        <Autocomplete
          options={users}
          getOptionLabel={(user) =>
            `Username: ${user.username}  Firstname: ${user.firstname}  Lastname: ${user.lastname}`
          }
          renderOption={(props, user) => (
            <li
              {...props}
              sx={{
                ...formFieldStyles,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                "& .label": {
                  fontWeight: "bold",
                },
              }}
            >
              <span className="label">Username: </span>
              <span>{user.username}</span>
              <span className="label">Firstname: </span>
              <span>{user.firstname}</span>
              <span className="label">Lastname: </span>
              <span>{user.lastname}</span>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Assign to User"
              variant="outlined"
              fullWidth
              required
              sx={formFieldStyles}
            />
          )}
          onChange={(event, newValue) => {
            setFormData({
              ...formData,
              assigned_user_id: newValue ? newValue.id : "",
            });
          }}
          sx={formFieldStyles}
        />
        <Button
          type="submit"
          variant="outlined"
          color="primary"
          sx={{ marginTop: "20px", ...formFieldStyles }}
        >
          Create Ticket
        </Button>
      </form>
    </Paper>
  );
}

export default CreateTicket;
