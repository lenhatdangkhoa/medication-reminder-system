// Entry point of the Medication Reminder System
const app = require('./src/app');
const {startWebSocket} = require('./src/services/websocketService');
const http = require('http');

const server = http.createServer(app);
startWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});