const express = require('express');
const dotenv = require("dotenv")
dotenv.config();

const userRouter = require('./Routers/userRouter')
const moviesRouter = require('./Routers/moviesRouter')
const theatresRouter = require('./Routers/theatresRouter')
const showsRouter = require('./Routers/showsRouter')
const bookingsRouter = require("./Routers/bookingsRouter")

const cors = require("cors");



const db = require("./config/MongoDBCon.js") // writing db is optional. Just the require(), runs the entire file.

const app = express()
app.use(cors(  {origin: [
            "http://localhost:3000",
            "https://bms-frontend.onrender.com"
        ],        credentials: true
}));


const PORT = process.env.PORT;
// console.log(process.env.PORT)

app.use("/bookings", bookingsRouter)

app.use(express.json())
app.use("/user", userRouter)
app.use("/movies", moviesRouter)
app.use("/theatres", theatresRouter)
app.use('/shows',showsRouter)

app.listen(PORT, () => {  
  console.log(`Server is running on http://localhost:${PORT}`);
});
