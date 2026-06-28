// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Test Route
app.get('/', (req, res) => {
    res.json({ message: "Welcome to Reservasi Polinela API Node.js" });
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const gedungRoutes = require('./routes/gedungRoutes');
const reservasiRoutes = require('./routes/reservasiRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const laporanRoutes = require('./routes/laporanRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/gedung', gedungRoutes);
app.use('/api/reservasi', reservasiRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/laporan', laporanRoutes);

// Server Listen
app.listen(PORT, () => {
    console.log(`✅ Backend API Server running...`);
    console.log(`🌐 Buka Website Reservasi disini: http://localhost:${PORT}/login.html`);
});
