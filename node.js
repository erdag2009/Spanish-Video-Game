const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let waitingPlayers = [];

wss.on('connection', (ws) => {
    console.log('A new player connected');

    // If the player disconnects while waiting, remove them from the queue
    ws.on('close', () => {
        waitingPlayers = waitingPlayers.filter(player => player !== ws);
        console.log('A player disconnected');
    });

    waitingPlayers.push(ws);

    if (waitingPlayers.length >= 2) {
        const player1 = waitingPlayers.shift();
        const player2 = waitingPlayers.shift();

        if (player1.readyState === WebSocket.OPEN && player2.readyState === WebSocket.OPEN) {
            player1.send(JSON.stringify({ type: 'matchFound' }));
            player2.send(JSON.stringify({ type: 'matchFound' }));

            player1.on('message', (message) => {
                if (player2.readyState === WebSocket.OPEN) {
                    player2.send(message);
                }
            });

            player2.on('message', (message) => {
                if (player1.readyState === WebSocket.OPEN) {
                    player1.send(message);
                }
            });

            player1.on('close', () => {
                if (player2.readyState === WebSocket.OPEN) {
                    player2.send(JSON.stringify({ type: 'opponentDisconnected' }));
                }
            });

            player2.on('close', () => {
                if (player1.readyState === WebSocket.OPEN) {
                    player1.send(JSON.stringify({ type: 'opponentDisconnected' }));
                }
            });
        }
    } else {
        ws.send(JSON.stringify({ type: 'waiting' }));
    }
});

console.log('WebSocket server is running on ws://localhost:8080');