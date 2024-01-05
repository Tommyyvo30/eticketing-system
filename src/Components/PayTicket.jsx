import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import fetchWithAuth from "../utils/api"; // Update the import path as needed

function PayTicket({ onBack }) {
  const navigate = useNavigate();
  const [selectedTicketId, setSelectedTicketId] = useState("");
  const [tickets, setTickets] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({
    creditCardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await fetchWithAuth(
        `http://localhost:3000/routes/ticket-history/${userId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error.message);
    }
  };

  const handleTicketChange = (event) => {
    setSelectedTicketId(event.target.value);
  };

  const handleInputChange = (prop) => (event) => {
    setPaymentDetails({ ...paymentDetails, [prop]: event.target.value });
  };

  const handlePayNow = () => {
    if (
      selectedTicketId &&
      paymentDetails.creditCardNumber &&
      paymentDetails.expirationDate &&
      paymentDetails.cvv
    ) {
      // Here you would handle the payment processing.
      console.log("Processing payment for ticket:", selectedTicketId);
      console.log("Payment details:", paymentDetails);
      // navigate('/payment-success'); // Navigate to the success page after processing the payment
    } else {
      // If no ticket is selected, prevent action
      console.log("Please select a ticket and enter payment details.");
    }
  };
  // Render the back button for both cases
  const renderBackButton = () => (
    <Button
      variant="outlined"
      color="primary"
      onClick={onBack}
      sx={{ marginTop: "1px", right: "593px" }}
    >
      &larr; Back
    </Button>
  );
  const selectedTicket = tickets.find(
    (ticket) => ticket.id === selectedTicketId
  );

  if (selectedTicket) {
    // Render the payment details page for the selected ticket
    return (
      <Paper sx={{ padding: "20px", margin: "20px", textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Pay Ticket #{selectedTicket.id}
        </Typography>
        <Typography variant="h6">
          Officer: {selectedTicket.officer_name}
        </Typography>
        <Typography variant="h6">
          Violation: {selectedTicket.violation}
        </Typography>
        <Typography variant="h6">
          Amount Due: ${selectedTicket.amount_due}
        </Typography>
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="credit-card-number">
            Credit Card Number
          </InputLabel>
          <OutlinedInput
            id="credit-card-number"
            value={paymentDetails.creditCardNumber}
            onChange={handleInputChange("creditCardNumber")}
            label="Credit Card Number"
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="expiration-date">Expiration Date</InputLabel>
          <OutlinedInput
            id="expiration-date"
            value={paymentDetails.expirationDate}
            onChange={handleInputChange("expirationDate")}
            label="Expiration Date"
          />
        </FormControl>
        <FormControl fullWidth sx={{ m: 1 }} variant="outlined">
          <InputLabel htmlFor="cvv">CVV</InputLabel>
          <OutlinedInput
            id="cvv"
            value={paymentDetails.cvv}
            onChange={handleInputChange("cvv")}
            label="CVV"
          />
        </FormControl>
        <Button variant="contained" color="primary" onClick={handlePayNow}>
          Confirm Payment
        </Button>
        {renderBackButton()}
      </Paper>
    );
  }

  // Render the dropdown to select a ticket
  return (
    <Paper sx={{ padding: "20px", margin: "20px", textAlign: "center" }}>
      <Typography variant="h4" gutterBottom>
        Select a Ticket to Pay
      </Typography>
      <FormControl fullWidth sx={{ marginBottom: "20px" }}>
        <InputLabel id="ticket-select-label">Ticket</InputLabel>
        <Select
          labelId="ticket-select-label"
          id="ticket-select"
          value={selectedTicketId}
          onChange={handleTicketChange}
        >
          {tickets.map((ticket) => (
            <MenuItem key={ticket.id} value={ticket.id}>
              Ticket ID: {ticket.id} - Violation: {ticket.violation} - Amount
              Due: ${ticket.amount_due}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button
        variant="contained"
        color="primary"
        disabled={!selectedTicketId}
        onClick={() => setSelectedTicketId("")}
      >
        Proceed to Payment
      </Button>
    </Paper>
  );
}

export default PayTicket;
