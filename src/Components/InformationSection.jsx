import React from "react";
import AboutUs from "./About.jsx";
import Contact from "./Contact.jsx";
import FAQ from "./FAQ.jsx";
import Paper from "@mui/material/Paper";

function InformationSection({ activeSection }) {
  return (
    <Paper sx={{ padding: "20px", margin: "20px" }}>
      {activeSection === "about" && <AboutUs />}
      {activeSection === "contact" && <Contact />}
      {activeSection === "faq" && <FAQ />}
    </Paper>
  );
}

export default InformationSection;
