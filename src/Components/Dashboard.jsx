import React, { useState } from "react";
import CreateTicket from "./CreateTicket.jsx";
import ManageUsers from "./ManageUsers.jsx";
import ReviewTickets from "./ReviewTickets.jsx";
import Heatmap from "./HeatMap.jsx";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import ViewTicketHistory from "./ViewTicketHistory.jsx";
import UpdateProfile from "./UpdateProfile.jsx";
import AccountDetails from "./AccountDetails.jsx";
import PayTicket from "./PayTicket.jsx";

function Dashboard({ role }) {
  const [currentView, setCurrentView] = useState("dashboard");

  const showCreateTicketForm = () => {
    setCurrentView("createTicket");
  };

  const showDashboard = () => {
    setCurrentView("dashboard");
  };

  const onTicketCreated = () => {
    showDashboard();
  };

  const showManageUsers = () => {
    setCurrentView("manageUsers");
  };

  const showReviewTickets = () => {
    setCurrentView("reviewTickets");
  };

  const showHeatmap = () => setCurrentView("heatmap");

  const showViewTicketHistory = () => {
    setCurrentView("viewTicketHistory");
  };
  const showUpdateProfile = () => {
    setCurrentView("updateProfile");
  };
  const userId = localStorage.getItem("userId");

  const showAccountDetails = () => {
    setCurrentView("accountDetails");
  };

  const showPayTicket = () => {
    setCurrentView("payTicket"); 
  }

  const handleEmailClick = () => {
    const email = 'contact@knteticketsystem.com';
    const subject = 'Subject of the email';
    const body = 'Body of the email';

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the default email client
    window.location.href = mailtoLink;
  };
  const handleEmailClick2 = () => {
    const email = 'contact@knteticketsystem.com';
    const subject = 'Subject of the email';
    const body = 'Body of the email';

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open the default email client
    window.location.href = mailtoLink;
  };
  const buttonStyle = {
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
  };
  const dashboardStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "40px",
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container sx={{ dashboardStyle }}>
        {" "}
        <Typography
          variant="h3"
          align="center"
          mt={3}
          mb={4}
          sx={{ fontFamily: "Courier", fontWeight: "bold" }}
        >
          {role === "admin" ? "Internal Dashboard" : "Client Dashboard"}
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          {role === "admin" && (
            <>
              <Button
                variant="contained"
                onClick={showManageUsers}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#5c94b4",
                  width: "200px",
                  margin: "8px",
                  padding: "30px",
                }}
              >
                Manage Users
              </Button>
              <Button
                variant="contained"
                onClick={showReviewTickets}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#8ebf6b",
                  width: "200px",
                  margin: "8px",
                }}
              >
                Review Tickets
              </Button>
              <Button
                variant="contained"
                onClick={showHeatmap}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#9b68b2",
                  width: "200px",
                  margin: "8px",
                }}
              >
                View Heatmap
              </Button>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#ed7f66",
                  width: "200px",
                  margin: "8px",
                }}
              >
                System Settings
              </Button>
              <Button 
                variant="contained"
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#5aa79c",
                  width: "200px",
                  margin: "8px",
                }} onClick = {handleEmailClick2}
              >
                User Feedback
              </Button>
              <Button
                variant="contained"
                onClick={showCreateTicketForm}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#d66753",
                  width: "200px",
                  margin: "8px",
                }} 
              >
                Create Ticket
              </Button>
            </>
          )}
          {role === "user" && (
            <>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#5c94b4",
                  width: "200px",
                  margin: "8px",
                  padding: "30px",
                }} onClick={showPayTicket}
              >
                Pay Ticket
              </Button>
              <Button
                variant="contained"
                onClick={showViewTicketHistory}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#8ebf6b",
                  width: "200px",
                  margin: "8px",
                }}
              >
                View Ticket History
              </Button>
              <Button
                variant="contained"
                onClick={showAccountDetails}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#9b68b2",
                  width: "200px",
                  margin: "8px",
                }}
              >
                View Account Details
              </Button>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#ed7f66",
                  width: "200px",
                  margin: "8px",
                }} onClick={handleEmailClick}
              >
                Contact Support
              </Button>
              <Button
                variant="contained"
                onClick={showUpdateProfile}
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#5aa79c",
                  width: "200px",
                  margin: "8px",
                }}
              >
                Update Profile
              </Button>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  backgroundColor: "#d66753",
                  width: "200px",
                  margin: "8px",
                }}
              >
                Notifications
              </Button>
            </>
          )}
        </Box>
      </Container>

      {currentView === "createTicket" && (
        <CreateTicket
          onBack={showDashboard}
          onTicketCreated={onTicketCreated}
        />
      )}
      {currentView === "manageUsers" && role === "admin" && (
        <ManageUsers onBack={showDashboard} />
      )}
      {currentView === "reviewTickets" && (
        <ReviewTickets onBack={showDashboard} />
      )}
      {currentView === "heatmap" && <Heatmap onBack={showDashboard} />}
      {currentView === "viewTicketHistory" && (
        <ViewTicketHistory onBack={showDashboard} />
      )}
      {currentView === "updateProfile" && (
        <UpdateProfile onBack={showDashboard} />
      )}
      {currentView === "accountDetails" && (
        <AccountDetails onBack={showDashboard} userId={userId} />
      )}
      {currentView === "payTicket" && (
        <PayTicket onBack = {showDashboard} userId = {userId} />
      )}
    </Box>
  );
}

export default Dashboard;
