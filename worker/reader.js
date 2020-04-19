const fs = require('fs');
const readline = require('readline');
const { parentPort, workerData } = require('worker_threads');

const filePath = workerData;

const readInterface = readline.createInterface({
    input: fs.createReadStream(filePath),
    output: false,
    console: true
});

readInterface.on('line', (line)=> {
    const parsedData = JSON.parse(line); 
    //sending evey line input to fsm thread
    parentPort.postMessage(parsedData);
    
});

readInterface.on('close', () => {
    console.log("Closes readstream");
    parentPort.postMessage("");
});
