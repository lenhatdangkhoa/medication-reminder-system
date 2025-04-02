// Websocket service for real-time TTS and STT

const WebSocket = require('ws');
const {createClient, LiveTranscriptionEvents} = require('@deepgram/sdk');
require('dotenv').config();
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
function startWebSocket(server) {
    deepgramReady = false;
    const audioBufferQueue = [];
    try {
    const wss = new WebSocket.Server({server, path: '/stream'});
    wss.on("connection", (twilioSocket) => {
        console.log("Connected to Twilio");

        // Connect to Deepgram
        const deepgramSocket = deepgram.listen.live({
            encoding: "mulaw",  
            sample_rate: 8000,
            language: "en-US",
          });

        deepgramSocket.on(LiveTranscriptionEvents.Open, () => {
            deepgramReady = true;
            console.log("Connected to Deepgram");
            deepgramSocket.on(LiveTranscriptionEvents.Close, () => {
                console.log("Deepgram closed.");
            });
            deepgramSocket.on(LiveTranscriptionEvents.Transcript, (data) => {
                console.log(data.channel.alternatives[0].transcript);
              });
            deepgramSocket.on(LiveTranscriptionEvents.Metadata, (data) => {
                console.log(data);
              });
            deepgramSocket.on(LiveTranscriptionEvents.Error, (err) => {
                console.error(err);
            });
            // If there are any audio buffers in the queue, flush them out
            // audioBufferQueue.forEach((audio) => {
            //     deepgramSocket.send(audio);
            // });
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
        // Close all connections 
        twilioSocket.on("close", () => {
            console.log("Disconnected from Twilio");
        });
    });
    } catch (error) {
        console.error("Error starting WebSocket server:", error);
    }
}

module.exports = { startWebSocket };