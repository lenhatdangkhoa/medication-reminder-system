const {createCall, sendReminder} = require('../services/twilioService');
const twilio = require('twilio');
require("dotenv").config();

async function startCall(req, res) {
    try {
        const {clientNumber} = req.body

        // If phone number is not provided, return an error
        if (!clientNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }
        const call = await createCall(clientNumber);
        res.status(200).send('Call initiated successfully');
    } catch (error) {
        console.error('Error initiating call:', error);
        res.status(500).send('Error initiating call');
    }
}
async function handleCallStatus(req, res) {
    const { AnsweredBy,CallStatus} = req.body;
    if (CallStatus === "completed") {
        if (AnsweredBy !== "human") {
            await sendReminder(req.body.To);
        }
        else {
            console.log("Status: Answered");
        }
    }
    res.status(200).end(); 
}


function handleVoiceWebhook (req, res) {
    const response = new twilio.twiml.VoiceResponse();
    console.log("starting webhook")
    response.start().stream({
        url: `wss://${process.env.NGROK_URL}/stream`, 
    });

    response.say('Hello, this is a reminder from your healthcare provider to confirm your medications for the day.\
        Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.');
    response.pause({length: 10});
    res.type('text/xml');
    res.send(response.toString());

  };

module.exports = {startCall,handleVoiceWebhook, handleCallStatus};