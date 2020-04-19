# upstox_assignment

# Websocket
run websocket as `node server.js` present inside `src` folder.

For client: open `candle.html` file in a browser which is presnt at `src/view`
and subscribe to any of the symbol e.g. `XETHZUSD` 
Which will print the output of computted trade.(in real time bases) along with candlestick graph

# File processor
run code as `node index.js` it will run reader worker thread,
which will read line by line data from the file mention in `index.js` file.
i.e. `/dataset/trades.json` or `/dataset/test.json`

Each line of data will then passed to fsm worker.
It computes trade data as per symbol and TS2 from passed json data in 15 seconds interval

Each computted data is then written in file `/dataset/subscribe.json`
Computted data is also sent to websocket to publish it to respective subscribers 

