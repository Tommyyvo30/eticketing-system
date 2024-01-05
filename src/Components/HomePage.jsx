import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import carImage from "../Assets/car.png";
import carImage2 from "../Assets/Car2.png";
function HomePage() {
  const pageStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    padding: "40px",
    background: "#f5f5f5",
    minHeight: "100vh",
  };

  const headingStyle = {
    color: "#333",
    fontFamily: "Courier New, monospace",
    fontWeight: "bold",
    fontSize: "3.5rem",
    marginBottom: "10px",
  };

  const subheadingStyle = {
    color: "#555",
    fontFamily: "Georgia, serif",
    fontSize: "1.5rem",
    fontStyle: "italic",
    textAlign: "center",
  };

  const buttonStyle = {
    marginTop: "20px",
    padding: "10px 30px",
    fontSize: "1.2rem",
    background: "#90caf9",
    color: "#333",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background 0.3s ease-in-out",
    textDecoration: "none",
    fontFamily: "Georgia, serif",
    fontWeight: "bold",
  };
  const roadContainerStyle = {
    position: "relative",
    marginTop: "200px",
  };
  const laneLines = [];
  for (let i = 0; i < window.innerWidth; i += 40) {
    laneLines.push(
      <div className="lane-lines" style={{ left: `${i}px` }} key={i}></div>
    );
  }
  return (
    <div style={pageStyle}>
      <div>
        <Typography variant="h1" gutterBottom style={headingStyle}>
          Welcome to KNT E-Ticket System
        </Typography>
        <Typography style={subheadingStyle}>
          Elevating your experience in traffic management and ticket handling.
        </Typography>
      </div>
      <Button
        variant="contained"
        component={Link}
        to="/auth"
        style={buttonStyle}
      >
        Get Started
      </Button>
      <div style={roadContainerStyle}>
        <div className="road-background">
          {laneLines}
          <div
            className="car"
            style={{
              animationDelay: "0s",
              backgroundImage: `url(${carImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="car"
            style={{
              animationDelay: "5s",
              backgroundImage: `url(${carImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="car"
            style={{
              animationDelay: "2s",
              backgroundImage: `url(${carImage})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="car2"
            style={{
              animationName: "moveCarLeft",
              animationDuration: "10s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: "2s",
              backgroundImage: `url(${carImage2})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="car2"
            style={{
              animationName: "moveCarLeft",
              animationDuration: "10s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: "5s",
              backgroundImage: `url(${carImage2})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <div
            className="car2"
            style={{
              animationName: "moveCarLeft",
              animationDuration: "10s",
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDelay: "0s",
              backgroundImage: `url(${carImage2})`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
