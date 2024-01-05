import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

function Header({ isLoggedIn, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const toggleDropdown = (event) => {
    setDropdownOpen(!dropdownOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setDropdownOpen(false);
    setAnchorEl(null);
  };

  const buttonStyle = {
    borderColor: "#4169E1",
    color: "#4169E1",
    margin: "0 10px",
  };
  const handleLogout = () => {
    handleClose();
    onLogout();
    navigate("/"); // Redirect to home page after logout
  };
  return (
    <AppBar
      position="fixed"
      color="default"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        {isLoggedIn && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDropdown}
            sx={{ marginRight: "10px" }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          KNT E-Ticket System
        </Typography>
        {dropdownOpen && isLoggedIn && (
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Log out</MenuItem>
          </Menu>
        )}
        <Button
          variant="outlined"
          sx={buttonStyle}
          component={Link}
          to="/contact"
        >
          Contact Us
        </Button>
        <Button
          variant="outlined"
          sx={buttonStyle}
          component={Link}
          to="/about"
        >
          About
        </Button>
        <Button variant="outlined" sx={buttonStyle} component={Link} to="/faq">
          FAQ
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
