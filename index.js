const express = require('express')
const connectDB = require("./src/config/db")
const cors = require('cors')

require('dotenv').config()
const UserRoute = require('./src/routes/userRoute')
const app = express()
app.use(cors({
    origin: "*", // Allow all domains (for testing only)
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization"
}));
app.use (express.json())
connectDB()
app.use('/',UserRoute)
PORT = process.env.PORT
app.listen(PORT,()=>console.log(`Listening at ${PORT}`))