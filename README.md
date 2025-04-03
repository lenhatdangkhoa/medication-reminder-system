

#  Medication Reminder System

A Node.js application that automates medication reminders via **phone calls**, **real-time voice transcription**, and **SMS follow-ups** using **Twilio** and **Deepgram**.

---

## Features

- Automatically call patients using Twilio Voice
- Real-time voice streaming to Deepgram via WebSocket
- Live transcription from Deepgram
- SMS reminders for missed or declined calls
- Patients can call back and hear a TTS message

---

## API Endpoints
| Method   | URL                                      | Description                              |
| -------- | ---------------------------------------- | ---------------------------------------- |
| `POST`    | `/call`                             |  	Initiates an outbound call to a client                  |
| `POST`   | `/voice`                             | Twilio hits this after call connects, for TwiML message                   |
| `POST`    | `/status`                          | Twilio status callback for call events                     |
| `POST`  | `/incoming`                          | Handles patient call-backs and replays message               |


----
## Project Structure
    .
    ├── server.js                      # main, execute this file
    ├── src                       
    |   ├── controllers             
    |       ├── mainController.js      # Handle business logic
    |   ├── routes
    |       ├── mainRoute.js.          # Handle routing
    |   ├── services
    |       ├── twilioService.js       # Twilio functions
    |       ├── websocketService.js    # websocket service
    |   ├── tests
    |       ├── twilioService.test.js  # Jest unit test, uncomplete :(
    |   ├── app.js                     # Connect the backbones together


----
## Run the app


Clone the repistory
```bash
git clone https://github.com/lenhatdangkhoa/medication-reminder-system.git
```
Install the required packaged
```bash
cd medication-reminder-system
npm i
```
Run the application. Make sure you configure ngrok. 
```bash
ngrok http 3000 
```
**Please copy and paste the ngrok url to the .env file** \
Create a `.env` file:

```env
DEEPGRAM_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-key
TWILIO_AUTH_TOKEN=your-key
TWILIO_NUMBER="your-twilio-number" 
NGROK_URL="your-ngrok-url" # Omit the https://
```
Then on a separate terminal, run
```bash
node server.js
```
To call the client, open a new terminal and enter this command. \
Note: Please change the ngrok_url to your ngrok url
```bash
curl -X POST http://<your_ngrok_url>:3000/call \
  -H "Content-Type: application/json" \
  -d '{"clientNumber": "+1XXXXXXXXXX"}'
```
You can also call your Twilio number on the phone. Just make sure you don't kill the `node server.js` terminal.

---
### Future Work and Limitations

- Voicemail is not supported currently due to limited documentation
- Connection to webhook is a bit slow
- Database is not set up
- Unit and integration testing is not set up