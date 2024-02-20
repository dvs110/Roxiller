require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./db");
const productRoute = require("./routes/products");

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/products", productRoute);

const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
