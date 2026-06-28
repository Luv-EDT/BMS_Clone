const express = require('express');
const userRouter = require('./Routers/userRouter')

const dotenv = require("dotenv")


dotenv.config();
  const db = require("./config/MongoDBCon.js") // writing db is optional. Just the require(), runs the entire file.


const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use("/user", userRouter)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
