import React, { useState, useEffect } from "react";
import fetchWithAuth from "../utils/api";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card"; // New import for Card
import CardActionArea from "@mui/material/CardActionArea"; // New import for clickable area
import Dialog from "@mui/material/Dialog"; // New import for Dialog
import DialogTitle from "@mui/material/DialogTitle"; // New import for Dialog Title
import DialogContent from "@mui/material/DialogContent"; // New import for Dialog Content
import DialogContentText from "@mui/material/DialogContentText"; //

function ViewTicketHistory({ onBack }) {
  const [ticketHistory, setTicketHistory] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:3000/routes/ticket-history/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Pass the auth token in the request
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTicketHistory(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
      <Button variant="outlined" onClick={onBack} sx={{ marginBottom: 2 }}>
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Ticket History
      </Typography>
      <List>
        {ticketHistory.map((ticket) => (
          <Card key={ticket.id} sx={{ marginBottom: 2 }}>
            <CardActionArea onClick={() => handleOpenDialog(ticket)}>
              <ListItem>
                <ListItemText
                  primary={`Violation: ${ticket.violation}`}
                  secondary="Click for Full Details"
                />
              </ListItem>
            </CardActionArea>
          </Card>
        ))}
      </List>
      {/* Dialog for showing ticket details */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{"Ticket Details"}</DialogTitle>
        <DialogContent>
          {selectedTicket && (
            <DialogContentText>
              <div>Officer name: {selectedTicket.officer_name}</div>
              <div>Violation: {selectedTicket.violation}</div>
              <div>Amount Due: {selectedTicket.amount_due}</div>
              <div>Details: {selectedTicket.details}</div>
              <div>Location of issued ticket: {selectedTicket.address}</div>
              <div>License plate: {selectedTicket.license_plate}</div>
            </DialogContentText>
          )}
        </DialogContent>
        <Button onClick={handleCloseDialog}>Close</Button>
      </Dialog>
    </Paper>
  );
}

export default ViewTicketHistory;
