/**
 * REST API endpoints for the Medication Reminder System.
 */
const controller = require('../controllers/mainController');
const express = require('express');
const router = express.Router();

// Define the API endpoints
router.post("/call", controller.startCall);
router.post("/voice", controller.handleVoiceWebhook);
router.post("/status", controller.handleCallStatus);
router.post("/incoming", controller.handleIncomingCall);

module.exports = router;