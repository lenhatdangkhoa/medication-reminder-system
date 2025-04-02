/**
 * Twilio Service
 * This service handles Twilio Voice API calls
 */
const twilio = require('twilio');
require('dotenv').config();

// Load Twilio SID, Auth Token, and Twilio Phone Number from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_NUMBER;

/**
 * Create a call using Twilio API
 * @param clientNumber - The phone number to call
 * @returns call - The Twilio call instance
 */
async function createCall(clientNumber) {
  
    console.log(`URL of Twilio Call: https://${process.env.NGROK_URL}/voice`);
    const call = await client.calls.create({
      from: twilioPhoneNumber,
      to: clientNumber,
      url: `https://${process.env.NGROK_URL}/voice`, 
      statusCallback: `https://${process.env.NGROK_URL}/status`,
      statusCallbackEvent: ["answered", "failed", "busy", "no-answer", "cancelled", "completed"], 
      machineDetection: 'Enable',
    });
    return call;
}

/**
 * Send a reminder SMS to the client
 * @param clientNumber - The phone number to send the reminder to
 * @returns result - The message instance
 */
async function sendReminder(clientNumber) {

  try {
    const result = await client.messages.create({
      from: process.env.TWILIO_NUMBER,
      to: clientNumber,                    
      body: "We called to check on your medication but couldn't reach you. Please call us back or take your medications if you haven't done so.",
    });
    console.log("Status: Voicemail/SMS sent");
    return result;

  } catch (error) {
    console.error('Error sending SMS:', error.message);
  }
  }

/**
 * Configure Twilio webhook for incoming calls
 */
async function configureTwilioWebhook() {

  try {
    const numbers = await client.incomingPhoneNumbers
      .list({ phoneNumber: process.env.TWILIO_NUMBER });

    if (!numbers.length) {
      console.error("No Twilio number found to update.");
      return;
    }

    const sid = numbers[0].sid;

    // Call to /incoming to handle incoming calls
    await client.incomingPhoneNumbers(sid).update({
      voiceUrl: `https://${process.env.NGROK_URL}/incoming`,
      voiceMethod: 'POST',
    });

  } catch (err) {
    console.error("Failed to configure Twilio webhook:", err.message);
  }
}

module.exports = {
  createCall,
  sendReminder,
  configureTwilioWebhook,
};

