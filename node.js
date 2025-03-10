const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let waitingPlayers = []; // Queue for players looking for a match

// When a new client connects
wss.on('connection', (ws) => {
    console.log('A new player connected');

    // Add the player to the waiting queue
    waitingPlayers.push(ws);

    // Check if there are two players in the queue
    if (waitingPlayers.length >= 2) {
        const player1 = waitingPlayers.shift();
        const player2 = waitingPlayers.shift();

        // Notify both players that a match has been found
        player1.send(JSON.stringify({ type: 'matchFound' }));
        player2.send(JSON.stringify({ type: 'matchFound' }));

        // Handle messages from player1
        player1.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.type === 'gameStateUpdate') {
                player2.send(message); // Send game state update to player2
            }
        });

        // Handle messages from player2
        player2.on('message', (message) => {
            const data = JSON.parse(message);
            if (data.type === 'gameStateUpdate') {
                player1.send(message); // Send game state update to player1
            }
        });

        // Handle disconnection of player1
        player1.on('close', () => {
            player2.send(JSON.stringify({ type: 'opponentDisconnected' }));
        });

        // Handle disconnection of player2
        player2.on('close', () => {
            player1.send(JSON.stringify({ type: 'opponentDisconnected' }));
        });
    } else {
        // Notify the player that they are waiting for an opponent
        ws.send(JSON.stringify({ type: 'waiting' }));
    }
});

console.log('WebSocket server is running on ws://localhost:8080');