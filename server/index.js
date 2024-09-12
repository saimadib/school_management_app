const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path=require ("path");
const app = express();
app.use(express.json());


// Enable CORS for all routes
app.use(cors());

const connectDB =require('./utils/db')
connectDB();

const teacherRoutes = require('./routes/teacherRoutes')
const studentRoutes = require('./routes/studentRoutes')
const classRoutes = require('./routes/classRoutes')
const authRoutes=require('./routes/authRoutes')
const analyticsRouter=require('./routes/analyticsRouter')

// Routes Middleware

app.use('/api/auth', authRoutes)
app.use('/api/analytics', analyticsRouter)
app.use('/api/teachers', teacherRoutes)
app.use('/api/students', studentRoutes)
app.use('/api/classes', classRoutes)

app.use(express.static("public"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

// // Routes
// app.get('/', (req, res) => {
//   res.send('School Management CRM Backend');
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
