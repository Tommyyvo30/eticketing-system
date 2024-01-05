import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useNavigate } from "react-router-dom";

function Contact({ isLoggedIn }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Paper sx={{ padding: "20px", margin: "20px", backgroundColor: "#f8f8f8", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}>
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: "10px", color: "#fff", backgroundColor: "#007bff" }}
        onClick={handleBack}
      >
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom color="primary">
        Contact Us
      </Typography>
      <Typography paragraph>
        For inquiries, support, or feedback, please reach out to us:
      </Typography>
      <List>
        <ListItem sx={{ borderBottom: "1px solid #ddd" }}>
          <ListItemText primary="📧 Email: contact@knteticketsystem.com" />
        </ListItem>
        <ListItem sx={{ borderBottom: "1px solid #ddd" }}>
          <ListItemText primary="📞 Phone: +1 234 567 8901" />
        </ListItem>
        <ListItem>
          <ListItemText primary="🏢 Address: 123 Fake Address Avenue, Fake City, Fake Country, Fake Postal Code" />
        </ListItem>
      </List>
    </Paper>
  );
}

export default Contact;
