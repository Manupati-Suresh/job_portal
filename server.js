// imports 

//const express = require('express')
import express from 'express';
import 'express-async-errors';
import dotenv from 'dotenv';
import colors from 'colors';
//security packages 
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize'





//routes imports 
import testRoutes from './routes/testRoutes.js';
import authRoutes from './routes/authRoutes.js';
// DB connection
import connectDB from "./config/db.js";

// midlleware 
import cors from 'cors';
import morgan from 'morgan'
import errorMiddleware from './middlewares/errorMiddleware.js';
import jobsRoutes from './routes/jobsRoute.js'

import userRoutes from './routes/userRoutes.js'



//dotenv config 
dotenv.config() // no need to add path because we have created  the dotenv file in the root directory 

// mongodb connection 
connectDB();
// rest object 
const app = express();

//middlewares 
app.use(helmet());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));



//routes 

app.use('/api/v1/test', testRoutes);

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);

app.use('/api/v1/job', jobsRoutes);


// validation middleware 
app.use(errorMiddleware);




//port 
const PORT = process.env.PORT || 8000

// listen 
app.listen(8000, () => {
    console.log(`Node server running In ${process.env.DEV_MODE} Mode on port no ${PORT}`.bgCyan.white);
});