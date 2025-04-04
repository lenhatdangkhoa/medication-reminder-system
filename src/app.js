/**
 * 
 * Configuration for the Medication Reminder System.
 */
const express = require('express');
const app = express();
app.use(express.json()); // Middleware to parse JSON requests
app.use(express.urlencoded({ extended: true }));
const callRoutes = require('./routes/mainRoute'); // Import all API routes from mainRoute.js
app.use('/', callRoutes); // Use the routes defined in mainRoute.js

module.exports = app;