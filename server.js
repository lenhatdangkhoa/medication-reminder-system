// Entry point of the Medication Reminder System
const app = require('./src/app');
const {startWebSocket} = require('./src/services/websocketService');
const {configureTwilioWebhook} = require('./src/services/twilioService');
const http = require('http');
// Configure the web socket server
const server = http.createServer(app);
startWebSocket(server); 
configureTwilioWebhook(); // For Twilio webhook, incoming calls
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});