const express = require('express');
const dotenv = require('dotenv');

dotenv.config();


const cors = require('cors');
const connectDB = require('./config/db');


// Connect to MongoDB
connectDB();
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('FitCoach AI API is running...');
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/clients', require('./routes/clientRoutes'));
//app.use('/api/v1/plans', require('./routes/planRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});