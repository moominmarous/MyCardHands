const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8000 });

wss.on('connection', (ws) => {
    console.log('A client connected.');

    // Broadcast messages to all connected clients
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        try {
            const data = JSON.parse(message);
            console.log(`incoming data: ${data}`)
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    // const m = JSON.stringify({ cardID: 'card1', x: 100, y: 200 });
                    client.send(JSON.stringify(data));
                }
            });

        } catch (error) {
            console.error('Failed to parse incoming message:', message, error);
        }
    });

    ws.on('close', () => {
        console.log('A client disconnected.');
    });
});