const { stdin: input, stdout: output } = process;
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const exit = function() {
    output.write('Good luck!\n');
    process.exit(0);
};

const outputFile = fs.createWriteStream(path.join(__dirname, 'log.txt'));
const rl = readline.createInterface({ input, output });

rl.question('Hello! Enter some text: \n', (text) => {
    outputFile.write(text + '\n');
});

rl.on('line', (text) => {
    if (text == 'exit') {
        rl.close();
        exit();
    }
    outputFile.write(text + '\n');
}).on('SIGINT', () => {
    exit();
}).on('close', () => {
    exit();
});
