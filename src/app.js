/**
 * Medication Reminder System
 * This is the main entry point for the Medication Reminder System.
 */

const express = require('express');
const app = express();
const callRoutes = require('./routes/mainRoute'); // Import all API routes from mainRoute.js
app.use(express.json()); // Middleware to parse JSON requests
app.use('/api', callRoutes); // Use the routes defined in mainRoute.js

module.exports = app;