const WebSocketServer = require('ws').Server;

const PubSubManager = require('./pub_sub');

const wss = new WebSocketServer({ port : 3001 });

wss.on('connection', (ws, req) => {
    console.log(`Connection request from: ${req.connection.remoteAddress}`);

    ws.on('message', (data) => {
        const json = JSON.parse(data);
        const request = json.request;
        const message = json.message;
        const channel = json.channel;

        switch (request) {
            case 'PUBLISH':
                PubSubManager.publish(channel, message);
                break;
            case 'SUBSCRIBE':
                PubSubManager.subscribe(channel,ws);
                break;
        }
    });

    ws.on('close', () => {
        console.log('Stopping client connection.');
    });
});

