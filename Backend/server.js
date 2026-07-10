const express = require('express');
const userRouter = require('./Routers/userRouter')
const moviesRouter = require('./Routers/moviesRouter')
const theatresRouter = require('./Routers/theatresRouter')
const cors = require("cors");



const dotenv = require("dotenv")

dotenv.config();
  const db = require("./config/MongoDBCon.js") // writing db is optional. Just the require(), runs the entire file.

const app = express()
app.use(cors());

const PORT = process.env.PORT;

app.use(express.json())
app.use("/user", userRouter)
app.use("/movies", moviesRouter)
app.use("/theatres", theatresRouter)

app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);
});
