const fs = require('fs')
const path = require('path')

filePath = path.join('01-read-file', 'text.txt')
fs.readFile(filePath, 'utf-8', (err, content) => {
    if (err) {
        throw err
    }
    console.log(content)
})

