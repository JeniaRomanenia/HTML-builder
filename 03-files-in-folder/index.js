const path = require('path');
const fs = require('fs');


filePath = path.join(__dirname, 'secret-folder');

fs.readdir(filePath, {withFileTypes : true}, (error, files) => {
    if (error) {
        throw error;
    } else {
        files.forEach(file => {
            if(file.isFile()) {
                fs.stat(path.join(filePath, file.name), (error, stats) =>{
                    if (error) {
                        throw error;
                    } else {
                        console.log(`${path.basename(file.name).split('.', 1)} - ${path.extname(file.name).slice(1)} - ${stats.size}`)
                    }
                })
            }
        })
    }
});
   
