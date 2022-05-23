const path = require('path');
const fs = require('fs/promises');

filesPath = path.join(__dirname, 'files');
filesCopyPath = path.join(__dirname, 'files-copy');

const copyDir = () => {
    fs.readdir(filesPath, {withFileTypes: true})
      .then(files => {
        files.forEach(file => {
          fs.copyFile(path.join(filesPath, file.name), path.join(filesCopyPath, file.name))
            .catch(error => console.log(error));
        });
      })
      .catch(error => console.log(error));
  };
  
  //удаление папки если она уже создана (force:(true) исключения будут игнорироваться, recursion:(true) рекурсивное удаление папки)
  fs.rm(filesCopyPath, {recursive: true, force: true})
    .then(() => {
      fs.mkdir(filesCopyPath)
        .then(() => copyDir())
        .catch(error => console.log(error));
    });       
