/**
 * REST API endpoints for the Medication Reminder System.
 */
const controller = require('../controllers/mainController');
const express = require('express');
const router = express.Router();

router.post("/call", controller.startCall);
router.post("/voice", controller.handleVoiceWebhook);
router.post("/status", controller.handleCallStatus);
module.exports = router;