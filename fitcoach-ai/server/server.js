require("dotenv").config();

const express = require('express');

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
app.use('/api/v1/workouts', require("./routes/workoutPlanRoutes"));
app.use('/api/v1/diets', require("./routes/dietPlanRoutes"));
app.use("/api/v1/portal", require("./routes/clientPortalRoutes")
);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  

