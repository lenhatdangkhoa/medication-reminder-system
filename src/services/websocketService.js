// Websocket service for real-time TTS and STT

const WebSocket = require('ws');
const Deepgram = require('@deepgram/sdk');
require('dotenv').config();

function startWebSocket(server) {
    deepgramReady = false;
    const audioBufferQueue = [];
    try {
    const wss = new WebSocket.Server({server, path: '/stream'});
    wss.on("connection", (twilioSocket) => {
        console.log("Connected to Twilio");

        // Connect to Deepgram
        const deepgramSocket = new WebSocket("wss://api.deepgram.com/v1/listen", {
            headers: {
                Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
            },
        });
        deepgramSocket.on("open", () => {
            deepgramReady = true;
            console.log("Connected to Deepgram");
            
            // If there are any audio buffers in the queue, flush them out
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

        // Transcribe audio from Deepgram
        deepgramSocket.on("message", (message) => {
            const data = JSON.parse(message);
            const transcript = data.channel.alternatives[0].transcript;
            if (transcript) {
                console.log("Transcription:", transcript);
            }
        });

        // Close all connections 
        twilioSocket.on("close", () => {
            console.log("Disconnected from Twilio");
            deepgramSocket.close();
        });
    });
    } catch (error) {
        console.error("Error starting WebSocket server:", error);
    }
}

module.exports = { startWebSocket };