# upstox_assignment

run code as `node index.js` it will run reader worker thread and will read line by line the data from file mention in index.js file.

Each line of data will then passed to fsm worker.
It computes trade data as per symbol and TS2 from passed json data 

TO DO:
Send fsm worker calculated data to socket which will emit to clints subscribed
