const express = require("express");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes");

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3001" }));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

// Use the userRoutes for all routes starting with "/routes"
app.use("/routes", userRoutes);

// Catchall handler for React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/build/index.html"));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
