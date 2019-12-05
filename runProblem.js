const process = require('process');
const childProcess = require('child_process');
const [year, problemNumber] = process.argv.slice(2);

const scriptPath = `./${year}/${problemNumber}`;

const child = childProcess.fork(scriptPath);

// // listen for errors as they may prevent the exit event from firing
// process.on('error', console.err);

// // execute the callback once the process has finished running
// process.on('exit', function (code) {
//     var err = code === 0 ? null : new Error('exit code ' + code);
//     if()
// });
