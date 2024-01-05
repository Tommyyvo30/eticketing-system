const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Pool } = require("pg");
const NodeGeocoder = require("node-geocoder");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "asddsa"; // Use environment variable in production

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "COMP370knt",
  port: 5432,
});

const geocoderOptions = {
  provider: "google",
  httpAdapter: "https",
  apiKey: "API KEY",
  formatter: null,
};
const geocoder = NodeGeocoder(geocoderOptions);

// Function to generate JWT
const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "1h" });
};

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// POST route to register a new user
router.post("/register", async (req, res) => {
  const {
    firstName,
    lastName,
    username,
    password,
    email,
    phone_number,
    drivers_license_number,
    address,
    gender,
    birthday, // Assuming birthday is passed in ISO format (YYYY-MM-DD)
  } = req.body;

  try {
    // Check for existing username
    const userByUsername = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (userByUsername.rows.length > 0) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Check for existing email
    const userByEmail = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (userByEmail.rows.length > 0) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Determine role based on email domain
    const role = email.endsWith("@knt.com") ? "admin" : "user";

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user with hashed password, role, and other details, then return the ID
    const result = await pool.query(
      "INSERT INTO users (firstName, lastName, username, password, email, role, phone_number, drivers_license_number, address, gender, birthday) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id",
      [
        firstName,
        lastName,
        username,
        hashedPassword,
        email,
        role,
        phone_number,
        drivers_license_number,
        address,
        gender,
        birthday,
      ]
    );

    const newUser = result.rows[0];
    const token = generateToken(newUser.id, newUser.role);
    res
      .status(201)
      .json({ message: `User added with ID: ${newUser.id}`, token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route for user login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await pool.query(
      "SELECT id, password, role FROM users WHERE username = $1",
      [username]
    );

    if (user.rows.length > 0) {
      const isValid = await bcrypt.compare(password, user.rows[0].password);
      if (isValid) {
        const token = generateToken(user.rows[0].id, user.rows[0].role);
        res.json({
          success: true,
          message: "Login successful",
          role: user.rows[0].role,
          token,
          userId: user.rows[0].id, // Return the user ID
        });
      } else {
        res.json({ success: false, message: "Invalid password" });
      }
    } else {
      res.json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST route to create a ticket
router.post("/create-ticket", authenticateToken, async (req, res) => {
  const {
    officer_name,
    violation,
    details,
    license_plate,
    assigned_user_id,
    address,
    amount_due,
  } = req.body;

  try {
    // Check if geocode for this address already exists
    const existingGeocode = await pool.query(
      "SELECT latitude, longitude FROM tickets WHERE address = $1",
      [address]
    );

    let latitude, longitude;

    if (
      existingGeocode.rows.length > 0 &&
      existingGeocode.rows[0].latitude &&
      existingGeocode.rows[0].longitude
    ) {
      latitude = existingGeocode.rows[0].latitude;
      longitude = existingGeocode.rows[0].longitude;
    } else {
      // Geocode the address
      const geocodeResult = await geocoder.geocode(address);
      if (geocodeResult.length > 0) {
        latitude = geocodeResult[0].latitude;
        longitude = geocodeResult[0].longitude;
      } else {
        return res
          .status(400)
          .json({ error: "Geocoding failed for the address" });
      }
    }

    // Insert ticket with geocoded data
    const result = await pool.query(
      "INSERT INTO tickets (officer_name, violation, details, license_plate, assigned_user_id, address, latitude, longitude, amount_due) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id",
      [
        officer_name,
        violation,
        details,
        license_plate,
        assigned_user_id,
        address,
        latitude,
        longitude,
        amount_due,
      ]
    );

    const ticketId = result.rows[0].id;
    res.status(201).json({ message: `Ticket added with ID: ${ticketId}` });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch all users
router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users WHERE role = 'user'");
    res.json(users.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch all tickets
router.get("/tickets", authenticateToken, async (req, res) => {
  try {
    const tickets = await pool.query("SELECT * FROM tickets");
    res.json(tickets.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// PUT route to update a user's profile
router.put("/update-profile/:userId", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const {
    firstname,
    lastname,
    email,
    phone_number,
    drivers_license_number,
    address,
    gender,
    birthday,
  } = req.body;

  try {
    let query = "UPDATE users SET ";
    const values = [];
    let count = 1;

    if (firstname) {
      query += `firstname = $${count}, `;
      values.push(firstname);
      count++;
    }
    if (lastname) {
      query += `lastname = $${count}, `;
      values.push(lastname);
      count++;
    }
    if (email) {
      query += `email = $${count}, `;
      values.push(email);
      count++;
    }
    if (phone_number) {
      query += `phone_number = $${count}, `;
      values.push(phone_number);
      count++;
    }
    if (drivers_license_number) {
      query += `drivers_license_number = $${count}, `;
      values.push(drivers_license_number);
      count++;
    }
    if (address) {
      query += `address = $${count}, `;
      values.push(address);
      count++;
    }
    if (gender) {
      query += `gender = $${count}, `;
      values.push(gender);
      count++;
    }
    if (birthday) {
      query += `birthday = $${count}, `;
      values.push(birthday);
      count++;
    }

    // Remove last comma and space
    query = query.slice(0, -2);

    // Add the WHERE clause
    query += ` WHERE id = $${count}`;
    values.push(userId);

    // Execute the query
    await pool.query(query, values);

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch current user's data
router.get("/current-user", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    // Fetch user data from the database
    const userData = await pool.query("SELECT * FROM users WHERE id = $1", [
      userId,
    ]);

    if (userData.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Exclude sensitive data
    const { password, ...userDetails } = userData.rows[0];

    // Return user data
    res.json(userDetails);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET route to fetch ticket history for a specific user
router.get("/ticket-history/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  if (req.user.userId !== parseInt(userId)) {
    return res.status(403).json({ error: "Unauthorized access to tickets" });
  }

  try {
    const ticketHistory = await pool.query(
      "SELECT * FROM tickets WHERE assigned_user_id = $1",
      [userId]
    );
    res.json(ticketHistory.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/account-details/:userId", authenticateToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const ticketCountResult = await pool.query(
      "SELECT COUNT(*) FROM tickets WHERE assigned_user_id = $1",
      [userId]
    );
    const totalAmountDueResult = await pool.query(
      "SELECT SUM(amount_due) as total FROM tickets WHERE assigned_user_id = $1",
      [userId]
    );

    if (ticketCountResult.rows.length === 0) {
      return res.status(404).json({ error: "No tickets found for user." });
    }

    res.json({
      ticketCount: parseInt(ticketCountResult.rows[0].count, 10),
      totalAmountDue: totalAmountDueResult.rows[0].total || 0,
    });
  } catch (error) {
    console.error("Error on fetching account details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
