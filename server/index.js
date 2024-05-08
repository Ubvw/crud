const express = require("express")
const app = express()
const cors = require("cors")
const pool = require("./db")


//middleware
app.use(cors())
app.use(express.json()) //req.body


//routes




//create

//read all todo

//get a todo

//update a todo









app.listen(5000, () => {
    console.log("Server has started on port 5000")
})
