const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const productRoutes=require("./routes/productRoutes");

const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes");// Import all user routes.

const transactionRoutes = require("./routes/transactionRoutes");

const dashboardRoutes = require("./routes/dashboardRoutes");
dotenv.config();// load environment variables from .env file

connectDB();// connect to database

const app = express();// create backend server and store it in app variable

app.use(cors());// allow requests from other domains

app.use(express.json());// parse JSON bodies in requests
app.use("/api/users",userRoutes);// use user routes for /api/users path

app.use("/api/products", productRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
    res.send("Inventiq API Running");
});// send a response to the client

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});// start the server and listen on the specified port
