/**
 * Twilio Service
 * This service handles Twilio Voice API calls
 */
const http = require('http');
const twilio = require('twilio');
require('dotenv').config();

// Load Twilio SID, Auth Token, and Twilio Phone Number from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_NUMBER;

// Create a call using Twilio Voice API
async function createCall(clientNumber) {
    console.log(`URL: https://${process.env.NGROK_URL}/voice`);
    const call = await client.calls.create({
      from: twilioPhoneNumber,
      to: clientNumber,
      url: `https://${process.env.NGROK_URL}/voice`, 
      asyncAmdStatusCallback: `https://${process.env.NGROK_URL}/status`,
      statusCallbackEvent: ["answered", "failed", "busy", "no-answer", "cancelled", "completed"], 
      machineDetection: 'Enable',
      asyncAmd: true,
      asyncAmdStatusCallbackMethod: 'POST',
    });
    console.log(`Calling the client at ${clientNumber}`);
    return call;
}

async function sendVoicemail(clientNumber, Sid) {
    await client.calls(Sid).update({
      twiml: `<Response>
        <Pause length="2"/>
        <Say>We called to check on your medication but couldn't reach you. Please call us back or take your medications if you haven't done so.</Say>
        <Say>Goodbye!</Say>
      </Response>`,
    });
  }

// Receive incoming calls
const voiceResponse = twilio.twiml.VoiceResponse;
function createCallHandler() {
    http.createServer((req, res) => { 
        const twiml = new voiceResponse();

        // Start streaming audio, you can please the url with yourn own ngrok url and keep /stream
        twiml.start().stream(`wss://${process.env.NGROK_URL}/stream`);
        console.log("stream started");
        twiml.say('Hello, this is a reminder from your healthcare provider to confirm your medications for the day. \
        Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.');
        res.writeHead(200, {'Content-Type': 'text/xml'});
        res.end(twiml.toString());
    })
    .listen(1337, '127.0.0.1');
    console.log('Twilio webhook listening at http://127.0.0.1:1337/');
}

module.exports = {createCall, createCallHandler, sendVoicemail};
