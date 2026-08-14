require("dotenv").config();

const express = require('express');

const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
// Middleware
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database Middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Database connection error",
    });
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Titan Trainer API is running...'
  });
});

app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/clients', require('./routes/clientRoutes'));
app.use('/api/v1/workouts', require("./routes/workoutPlanRoutes"));
app.use('/api/v1/diets', require("./routes/dietPlanRoutes"));
app.use("/api/v1/portal", require("./routes/clientPortalRoutes")
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
  
