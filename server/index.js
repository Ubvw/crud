

const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

// Middleware
app.use(cors());
app.use(express.json()); // req.body

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error("Error executing query", err);
  } else {
    console.log("PostgreSQL time:", res.rows[0].now);
  }
});

// Routes
// Create
app.post("/loyalties", async (req, res) => {
  try {
    const { first_name, last_name } = req.body;

    const currentDate = new Date();
    const expiryDate = new Date(currentDate);
    expiryDate.setFullYear(currentDate.getFullYear() + 5);

    const newLoyalty = await pool.query(
      "INSERT INTO loyalty (first_name, last_name, date_creation, date_expiry) VALUES ($1, $2, CURRENT_TIMESTAMP, $3) RETURNING *",
      [first_name, last_name, expiryDate]
    );

    res.json(newLoyalty.rows[0]);
  } catch (err) {
    console.error("Error creating loyalty card: ", err.message);
    res.status(500).send("Server Error");
  }
});

// Display all loyalty cards
app.get("/loyalties", async (req, res) => {
  try {
    const loyaltyList = await pool.query(
      "SELECT id, first_name, last_name, date_creation, date_expiry FROM loyalty"
    );

    const formattedLoyaltyList = loyaltyList.rows.map((loyalty) => {
      const formattedCreationDate = new Date(
        loyalty.date_creation
      ).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      const formattedExpiryDate = new Date(
        loyalty.date_creation
      ).toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        ...loyalty,
        date_creation: formattedCreationDate,
        date_expiry: formattedExpiryDate,
      };
    });

    res.json(formattedLoyaltyList);
  } catch (err) {
    console.error("Error displaying loyalty cards list: ", err.message);
  }
});

// Update a loyalty card
app.put("/loyalties/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const { first_name, last_name } = req.body;
    const updateLoyalty = await pool.query(
      "UPDATE loyalty SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *",
      [first_name, last_name, id]
    );

    res.json("Loyalty Card was updated!");
  } catch (err) {
    console.error("Error updating loyalty card: ", err.message);
  }
});

// Delete a loyalty card
app.delete("/loyalties/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const deleteLoyalty = await pool.query(
      "DELETE FROM loyalty WHERE id = $1",
      [id]
    );

    res.json("Loyalty Card was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server has started on port ${PORT}`);
});
