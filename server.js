import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js"
import productRoutes from "./routes/productRoutes.js"
import cors from "cors";
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');

dotenv.config()

//databse config
connectDB();


const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes)


// Add routes for user registration, property listing, etc.
app.get("/", (req, res) => {
    res.send({
        message: "Welcome"
    })
})

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));