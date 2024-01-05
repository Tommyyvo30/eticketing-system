import React, { useState, useEffect } from "react";
import fetchWithAuth from "../utils/api";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";

function AccountDetails({ userId, onBack }) {
  const [accountInfo, setAccountInfo] = useState({
    ticketCount: 0,
    totalAmountDue: 0,
  });

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetchWithAuth(
          `http://localhost:3000/routes/account-details/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch account details");
        const data = await response.json();
        setAccountInfo(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userId) {
      fetchAccountInfo();
    }
  }, [userId]);

  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
      <Button variant="outlined" onClick={onBack} sx={{ marginBottom: 2 }}>
        &larr; Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Account Details
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary={`Tickets Received: ${accountInfo.ticketCount}`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Total Amount Due: $${accountInfo.totalAmountDue}`}
          />
        </ListItem>
      </List>
    </Paper>
  );
}

export default AccountDetails;
