const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
// Load environment variables
dotenv.config({path: './.env'});

// Init Server

const app = express();
connectDB();

//Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user')

//middlewares
app.use(morgan('dev'));
app.use(express.json());
// if(process.env.NODE_ENV === 'development'){
//     app.use(cors({origin: 'http://localhost:3000'}))
// }
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`The server is up and running on port ${PORT}`)
})