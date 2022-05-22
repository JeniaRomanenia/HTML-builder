const path = require('path');
const fs = require('fs');

const { stdin, stdout } = process;
filePath = path.join('02-write-file', 'text.txt')

fs.writeFile(filePath, '', err => {
    if(err) {
        throw err;
    }
});

stdout.write('Приветствую! Введите что нибудь...\n');
stdin.on('data', data => {
    let string = data.toString();
    if (string.trim() === 'exit') {
        stdout.write('Удачи!');
        process.exit();
    } else {
        fs.appendFile (
            filePath,
            data,
            err => {
                if (err) {
                    throw err;
                }
            }
        );
    }
});
process.on('SIGINT', () => {
    stdout.write('\nУдачи!');
    process.exit();
  });
