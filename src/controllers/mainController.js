/**
 * Main controller to handle all logic for the medication reminder system.
 */

const {createCall, sendReminder} = require('../services/twilioService');
const twilio = require('twilio');
require("dotenv").config();
/**
 * Start a call to the client using Twili service.
 * @param req - The request object
 * @param res - The response object 
 */
async function startCall(req, res) {

    try {
        const {clientNumber} = req.body

        // If phone number is not provided, return an error
        if (!clientNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        await createCall(clientNumber);
        res.status(200).send('Call initiated successfully');
        
    } catch (error) {
        console.error('Error initiating call:', error);
        res.status(500).send('Error initiating call');
    }
}

/**
 * Handle the status of the call
 * @param req - The request object
 * @param res - The response object
 */
async function handleCallStatus(req, res) {

    const { AnsweredBy,CallStatus, CallSid} = req.body;
    if (CallStatus === "completed") {
        // If the call was answered by a machine or fax, send a reminder SMS
        if (AnsweredBy == "machine_start" || AnsweredBy == "fax") {
            console.log("Call SID: ", CallSid);
            await sendReminder(req.body.To);
        }
        else {
            console.log("Call SID: ", CallSid);
            console.log("Status: Answered");
        }
    }
    res.status(200).end(); 
}

/**
 * Send an incoming call response.
 * @param req - The request object
 * @param res - The response object
 */
async function handleIncomingCall (req, res)  {
    const response = new twilio.twiml.VoiceResponse();
    response.say("Hello, this is a reminder from your healthcare provider to confirm your medications for the day. Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.");
    response.hangup();
    res.type('text/xml').send(response.toString());
  };

  /**
   * Handle the voice webhook for the call.
   * Streams audio to Deepgram for transcription.
   * @param req - The request object
   * @param res - The response object
   */
function handleVoiceWebhook (req, res) {

    const response = new twilio.twiml.VoiceResponse();    
    response.start().stream({
        url: `wss://${process.env.NGROK_URL}/stream`, 
    });
    response.say('Hello, this is a reminder from your healthcare provider to confirm your medications for the day.\
        Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.');
    response.pause({length: 10}); // Allows time for the user to respond
    res.type('text/xml');
    res.send(response.toString());
    
  };

module.exports = {startCall,handleVoiceWebhook, handleCallStatus, handleIncomingCall};