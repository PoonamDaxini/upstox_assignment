const { isMainThread, parentPort, Worker } = require('worker_threads');
const fs = require('fs');

const current_dirname = __dirname;
const fileToWrite = current_dirname + '/../dataset/subscribe.json';

const webSocketWorker = new Worker('./worker/websocket.js');


if (!isMainThread) {
    let tradeData = {};

    parentPort.on('message', (trade) => {
        if(typeof trade === "object") {
            const checkBarNum = (seconds) => {
                let bar = 1;
                let startTime = trade.startTime;
                const currentTime = trade.TS2;
                
                while(currentTime > startTime) {
                    bar = bar + 1;
                    startTime = startTime + 15000000000;
                }

                return bar;
            }
        
            let currentBar = checkBarNum(trade.TS2);
            setTradeData(trade, currentBar, tradeData);
            fs.writeFileSync(fileToWrite, JSON.stringify(tradeData, null,'\t'));

        } else {
            fs.writeFileSync(fileToWrite, JSON.stringify(tradeData[trade], null,'\t'));
            parentPort.postMessage(JSON.stringify(tradeData[trade]));
        }
    });
}
    
const setTradeData = (trade, bar_num, tradeData) => {
    // const tradeData = message;
    const setNewTrade = (bar_num,volume = null) => {
        if(!volume){
            tradeData[trade.sym] = [];
        }
        const symbol = trade.sym;
        const pushData = {
            event: "ohlc_notify",
            symbol: symbol,
            bar_num: bar_num,
            o: trade.P,
            h: trade.P,
            l: trade.P,
            c: trade.P,
            volume: !volume ? trade.Q : volume
        }
        tradeData[symbol].push(pushData);
        webSocketWorker.postMessage(pushData); 
    }
    
    if(trade.sym in tradeData) {
        const previousTrades = tradeData[trade.sym];
        const latestTrade = previousTrades[previousTrades.length - 1];
        if(latestTrade.bar_num === bar_num) {
            // console.log(latestTrade, trade);
            const pushData = {
                event: "ohlc_notify",
                symbol: trade.sym,
                bar_num: bar_num,
                o: latestTrade.o,
                h: trade.P > latestTrade.h ? trade.P : latestTrade.h,
                l: trade.P < latestTrade.l ? trade.P : latestTrade.l,
                c: trade.P,
                volume: (trade.Q + latestTrade.volume)
            }
            webSocketWorker.postMessage(pushData); 
            tradeData[trade.sym].push(pushData);
        } else {
            setNewTrade(bar_num, trade.Q);
        }
    } else {
        setNewTrade(bar_num);
    }
    
}
