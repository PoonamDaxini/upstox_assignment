const { Worker, isMainThread } = require('worker_threads');

let symbolStartTime = {};

if (isMainThread) {
    // module.exports = async function 
    const current_dirname = __dirname;
    const fileToRead = current_dirname + '/dataset/trades.json';
    // const fileToRead = current_dirname + '/dataset/test.json';

    const readWorker = new Worker('./worker/reader.js',{
        workerData : fileToRead
    });

    const fsmWorker = new Worker('./worker/fsm.js');

    // const fsmWorker = new Worker('./worker/fsm.js');

    readWorker.on('message', (message) => {
        //reader is reading line and sending the data
        //assumption is meeage is in json parsed format and contains TS2 fields and sym fields

        if(!(message.sym in symbolStartTime)){
            symbolStartTime[message.sym] = message.TS2;
        }

        message.startTime = symbolStartTime[message.sym];

        fsmWorker.postMessage(message);    
    });

    readWorker.on('error', (error) => {
        console.log("in read error");

        console.log(error);
        // need to handle via sending mail or something to indicate process failure
    });

    readWorker.on('exit', () => { 
        console.log("read worker exists");
    });

    
}else{
    console.log(isMainThread);
} 