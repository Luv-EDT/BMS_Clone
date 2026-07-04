
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  
  name: {
    type: String,
    required: true,
  },

  userId: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  
  isAdmin: {
    type: String,
  },
});

const User = mongoose.model(
  "User",      // Model name
  userSchema,  // Structure of documents
  "users"      // MongoDB collection name
);



module.exports = User;