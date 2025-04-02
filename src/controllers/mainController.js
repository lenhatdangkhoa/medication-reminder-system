const {createCall, sendVoicemail} = require('../services/twilioService');
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
    const { CallSid, AnsweredBy, Status, Duration} = req.body;
    console.log(req.body);
    if (AnsweredBy === "machine_start") {
        console.log("Sending Voicemail");
        await sendVoicemail(req.body.To, CallSid);
    }
    res.status(200).end(); // always respond 200 OK
}

async function handleVoicemail(req, res) {
    const twiml = new twilio.twiml.VoiceResponse();
    twiml.pause({length: 2});
    twiml.say( "We called to check on your medication but couldn't reach you. Please call us back or take your medications if you haven't done so.");
    res.type('text/xml').send(twiml.toString());
}

function handleVoiceWebhook (req, res) {
    const answeredBy = req.body.AnsweredBy || req.query.AnsweredBy;
    const response = new twilio.twiml.VoiceResponse();

    if (answeredBy === 'machine_start') {
        console.log("📩 Voicemail detected — sending voicemail message");

        response.pause({ length: 2 });
        response.say("We called to check on your medication but couldn't reach you.");
        response.say("Please take your medications. Goodbye.");
        response.hangup();
    } else {
        console.log("starting webhook")
        response.start().stream({
        url: `wss://${process.env.NGROK_URL}/stream`, 
        });
    
        response.say('Hello, this is a reminder from your healthcare provider to confirm your medications for the day.\
            Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.');
        response.pause({length: 5});
        res.type('text/xml');
        res.send(response.toString());
    }
  };

module.exports = {startCall,handleVoiceWebhook, handleCallStatus, handleVoicemail};