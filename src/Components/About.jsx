import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

function AboutUs({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Paper sx={{ padding: "20px", margin: "20px", backgroundColor: "#f8f8f8" }}>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: "10px", color: "#fff", backgroundColor: "#007bff" }}
        onClick={handleBack}
      >
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom color="primary">
        About Us
      </Typography>
      <Typography paragraph>
        We are KNT E-Ticket System, a pioneering company dedicated to
        modernizing traffic management systems...
      </Typography>
    </Paper>
  );
}

export default AboutUs;
