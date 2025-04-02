// Websocket service for real-time TTS and STT

const WebSocket = require('ws');
const {createClient, LiveTranscriptionEvents} = require('@deepgram/sdk');
require('dotenv').config();
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

/**
 * Start the WebSocket server for streaming audio to Deepgram
 * 
 * @param {Server} server - The HTTP server instance
 */
function startWebSocket(server) {
    deepgramReady = false; // Flag to check if Deepgram is ready
    let conversation = "";
    const audioBufferQueue = []; // Queue to store audio buffers before Deepgram is ready

    try {
        // Create a WebSocket server
        // Path is set to '/stream' to match Twilio webhook
        const wss = new WebSocket.Server({server, path: '/stream'});

        wss.on("connection", (twilioSocket) => {

            // Connect to Deepgram
            const deepgramSocket = deepgram.listen.live({
                encoding: "mulaw",  
                sample_rate: 8000,
                language: "en-US",
            });

            deepgramSocket.on(LiveTranscriptionEvents.Open, () => {
                deepgramReady = true;

                // Close the Deepgram socket when the Twilio socket closes
                deepgramSocket.on(LiveTranscriptionEvents.Close, () => {
                    const unwanted = 'Hello, this is a reminder from your healthcare provider to confirm your medications for the day.\
        Please confirm if you have taken your Aspirin, Cardivol, and Metformin today.'
                    console.log(`Conversation: "${conversation.replace(unwanted, "")}"`);
                    console.log("Deepgram closed.");
                });

                // Listen for the transcript event and output them
                deepgramSocket.on(LiveTranscriptionEvents.Transcript, (data) => {
                    conversation += data.channel.alternatives[0].transcript;
                    console.log(data.channel.alternatives[0].transcript);
                });

                // Uncomment this if you want to see the metadata after
                // deepgramSocket.on(LiveTranscriptionEvents.Metadata, (data) => {
                //     console.log(data);
                //   });

                deepgramSocket.on(LiveTranscriptionEvents.Error, (err) => {
                    console.error(err);
                });

                //If there are any audio buffers in the queue, flush them out. Prevents audio loss
                audioBufferQueue.forEach((audio) => {
                    deepgramSocket.send(audio);
                });
            });

            // Send voice data to Deepgram
            twilioSocket.on("message", (message) => {
                const data = JSON.parse(message);
                if (data.event === "media") {
                    const audio = Buffer.from(data.media.payload, "base64");
                    if (deepgramReady) {
                        deepgramSocket.send(audio);
                    } else {
                        audioBufferQueue.push(audio);
                    }
                }
            });

            // Close Twilio Connection 
            twilioSocket.on("close", () => {
                console.log("Disconnected from Twilio");
            });
        });
        
    } catch (error) {
        console.error("Error starting WebSocket server:", error);
    }
}

module.exports = { startWebSocket };