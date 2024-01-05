import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function FAQ({ onBack, isLoggedIn }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <Paper
      sx={{
        padding: "20px",
        margin: "20px",
        backgroundColor: "#f8f8f8",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        sx={{ marginBottom: "10px", color: "#fff", backgroundColor: "#007bff" }}
        onClick={handleBack}
      >
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom color="primary">
        Frequently Asked Questions
      </Typography>
      <Accordion sx={{ marginBottom: "16px", backgroundColor: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ background: "#f5f5f5", color: "#333" }}
        >
          <Typography variant="h6">How do I pay a ticket?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Log in to your account, select the ticket, and proceed with the payment options available.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ marginBottom: "16px", backgroundColor: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ background: "#f5f5f5", color: "#333" }}
        >
          <Typography variant="h6">Can I dispute a ticket?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Yes, you can submit a dispute form online through your account for review.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion sx={{ marginBottom: "16px", backgroundColor: "#fff" }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ background: "#f5f5f5", color: "#333" }}
        >
          <Typography variant="h6">What payment methods are accepted?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            We accept all major credit cards, debit cards, and online bank transfers. We do not accept mail-in cheques.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
}

export default FAQ;
