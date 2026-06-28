const mongoose = require("mongoose");

// console.log(process.env.DB_URI)
mongoose.connect(process.env.DB_URI);

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("Database connected.");
});

connection.on("error", (err) => {
    console.log("MongoDB connection error:", err);
});