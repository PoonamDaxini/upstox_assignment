const { isMainThread, parentPort } = require('worker_threads');
const WebSocket = require('ws');


if (!isMainThread) {
    parentPort.on('message', (trade) => {
        console.log("here....");
        
        const ws = new WebSocket('ws://localhost:3001');

        console.log(trade.symbol);
        ws.onopen = function () {
            ws.send(JSON.stringify({
                request: 'PUBLISH',
                message: JSON.stringify(trade),
                channel: trade.symbol
            }));
            ws.close();
        };
        ws.onerror = function(err) {
            console.log(err);
        };
    });
}