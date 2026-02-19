const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyzeRoutes = require('./routes/analyze');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow all origins for simplicity in hackathon
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('PharmaGuard Backend is Running. Use POST /analyze to submit VCF files.');
});

app.use('/', analyzeRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong!' });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
