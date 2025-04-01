/**
 * Twilio Service
 * This service handles Twilio Voice API calls
 */

const twilio = require('twilio');
require('dotenv').config();
// Load Twilio SID, Auth Token, and Twilio Phone Number from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
console.log(authToken)
const client = twilio(accountSid, authToken);
const twilioPhoneNumber = process.env.TWILIO_NUMBER;


async function createCall() {

    const call = await client.calls.create({
  
      from: twilioPhoneNumber,
      to: "+17064616521",
      twiml: "<Response><Say>Test Hello There</Say></Response>",
    });
    console.log(call.sid);
  }
  
createCall()
