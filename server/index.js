const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");


//middleware
app.use(cors());
app.use(express.json()); //req.body


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error executing query', err);
    } else {
        console.log('PostgreSQL time:', res.rows[0].now);
    }
});

//routes

//create
function calculateDates(dateCreation) {
    const expiryDate = new Date(dateCreation);
    expiryDate.setFullYear(expiryDate.getFullYear() + 5); // Add 5 years
    const today = new Date();
    const remainingDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return { date_expiry: expiryDate, days_remaining: remainingDays };
  }
  
app.post("/loyalties", async (req, res) => {
try {
    const { first_name, last_name } = req.body;
    const { date_expiry, days_remaining } = calculateDates(new Date());
    
    const newLoyalty = await pool.query(
    "INSERT INTO loyalty (first_name, last_name, date_creation, date_expiry, days_remaining) VALUES ($1, $2, CURRENT_DATE, $3, $4) RETURNING *",
    [first_name, last_name, date_expiry, days_remaining]
    );

    res.json(newLoyalty.rows[0]);
} catch (err) {
    console.error("Error creating loyalty card: ", err.message);
    res.status(500).send("Server Error");
}
});













//search by ID
app.get("/loyalties/:id", async (req, res) =>{
    try{
        const { id } = req.params;
        const loyalty = await pool.query("SELECT * FROM loyalty WHERE ID = $1", [id]);

        if (loyalty.rows.length === 0){
            return res.status(404).json({ message: "Loyalty card not found"});
        }
        res.json(loyalty.rows[0])
    } catch (err){
        console.error("Error searching for loyalty card:", err.message);
        res.status(500).send("Server Error");
    };
});


//Display all loyalty cards
app.get("/loyalties", async (req, res) => {
    try {
        const loyaltyList = await pool.query("SELECT first_name, last_name, date_creation, date_expiry, remaining FROM loyalty");

        res.json(loyaltyList.rows);
    } catch (err){
        console.error("Error displaying loyalty cards list: ", err.message);
    }
    
});

//update a loyalty card
app.put("/loyalties/:id", async (req, res) => {
    try{
        const [ id ] = req.params;
        const [first_name, last_name] = req.body;
        const updateLoyalty = await pool.query("UPDATE loyalty SET first_name = $1, last_name = $2 WHERE id = $3 RETURNING *", [first_name, last_name, id]);

        res.json("Loyalty Card was updated!");
    } catch (err) {
        console.error("Error updating loyalty card: ", err.message);
    }
});


//delete a loyalty card
app.delete("/loyalties/:id", async (req, res) => {
    try{
        const [ id ] = req.params;
        const deleteLoyalty = await pool.query("DELETE FROM loyalty WHERE id = $1", [id]);

        res.json("Loyalty Card was deleted!");
    } catch (err){
        console.log(err.message);
    }
});

app.listen(5000, () => {
    console.log("Server has started on port 5000")
})
