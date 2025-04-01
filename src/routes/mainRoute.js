/**
 * REST API endpoints for the Medication Reminder System.
 */
const controller = require('../controllers/mainController');
const express = require('express');
const router = express.Router();

router.post("/call", controller.startCall);

module.exports = router;