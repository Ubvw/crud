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
app.post("/loyalties", async (req, res) => {
    try {
        const { first_name, last_name } = req.body;
   
        const currentDate = new Date();
        const expiryDate = new Date(currentDate);
        expiryDate.setFullYear(currentDate.getFullYear() + 5);

        // Insert the loyalty record with the calculated date_expiry
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
        const loyaltyList = await pool.query("SELECT id, first_name, last_name, date_creation, date_expiry FROM loyalty");

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
