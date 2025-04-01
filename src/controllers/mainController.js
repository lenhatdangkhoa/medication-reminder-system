const {createCall} = require('../services/twilioService');

async function startCall(req, res) {
    try {
        const {clientNumber} = req.body

        // If phone number is not provided, return an error
        if (!phoneNumber) {
            return res.status(400).json({ message: 'Phone number is required' });
        }
        const call = await createCall(clientNumber);
        res.status(200).send('Call initiated successfully');
    } catch (error) {
        console.error('Error initiating call:', error);
        res.status(500).send('Error initiating call');
    }
}