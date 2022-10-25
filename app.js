import dotenv from 'dotenv';
// Config krna hoga dotenv ko
dotenv.config()
import express  from 'express';
import cors from 'cors';
import connectDB from './config/connectdb';
import userRoutes from './routes/userRoutes';
import bodyParser from 'body-parser';

const app = express()
const port = process.env.PORT
const DATABASE_URL = process.env.DATABASE_URL

// CORS POLICY
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Database Connection
connectDB(DATABASE_URL)

// Load Routes
app.use("/api/user",userRoutes)

// JSON
app.use(express.json())
app.listen(port, () => {
    console.log(`Server is listening at ${port}`);
})