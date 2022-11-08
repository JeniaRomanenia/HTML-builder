const path = require('path');
const fs = require('fs');
const fsP = require('fs/promises');
const htmlTemplatePath = path.join(__dirname, 'template.html');
const htmlCompPath = path.join(__dirname, 'components');
const stylesPath = path.join(__dirname, 'styles');
const distPath = path.join(__dirname, 'project-dist');
const assetsPath = path.join(distPath, 'assets');

const findFolder = async (folder) => {
  let folderExisting;
  await fs.access(folder, async (error) => {
    if (!error) folderExisting = true;
    else folderExisting = false;
  });
  return folderExisting;
};

const newFolder = async (folder) => {
  if (await findFolder(folder)) {
    await fsP.rm(folder, { recursive: true });
  }
  await fsP.mkdir(folder, { recursive: true });
  return true;
};

const copyFiles = async (actualDir, nextDir, fileName) => {
  await fs.copyFile(
    path.join(actualDir, fileName),
    path.join(nextDir, fileName),
    function (error) {
      if (error) console.log(error.message);
    },
  );
};

const buildAssets = async (actualDir, nextDir) => {
  const files = await fsP.readdir(actualDir, { withFileTypes: true });
  for (let file of files) {
    if (file.isFile()) copyFiles(actualDir, nextDir, file.name);
    else {
      if (await newFolder(path.join(assetsPath, file.name))) {
        buildAssets(
          path.join(actualDir, file.name),
          path.join(nextDir, file.name),
        );
      }
    }
  }
};

const buildHtml = async () => {
  await fs.readFile(htmlTemplatePath, 'utf-8', (error, data) => {
    if (error) console.log(error.message);
    let htmlToChange = data;
    let regex = /{{[\s\S]+?}}/g;
    const tagsNames = htmlToChange.match(regex);
    for (let tag of tagsNames) {
      const tagPath = path.join(htmlCompPath, tag.slice(2, -2) + '.html');
      fs.readFile(tagPath, 'utf-8', (error, tagHtml) => {
        if (error) console.log(error.message);
        if (htmlToChange.includes(tag)) {
          htmlToChange = htmlToChange.replace(tag, tagHtml);
          fs.writeFile(
            path.join(distPath, 'index.html'),
            htmlToChange,
            (error) => {
              if (error) console.log(error.message);
            },
          );
        }
      });
    }
  });
};

const buildCss = async (actualDir, nextDir) => {
  const streamWrite = await fs.createWriteStream(nextDir);
  let files = await fsP.readdir(actualDir, { withFileTypes: true });
  files = files.reverse();
  for (let file of files) {
    if (
      file.isFile() &&
      path.extname(path.join(stylesPath, file.name)) === '.css'
    ) {
      const stream = fs.createReadStream(path.join(stylesPath, file.name), {
        encoding: 'utf-8',
      });
      stream.pipe(streamWrite);
    }
  }
};

function makingDistFolder() {
  newFolder(distPath);
  newFolder(assetsPath);
  makingDist();
}

async function makingDist() {
  buildHtml();
  buildAssets(path.join(__dirname, 'assets'), assetsPath);
  if (await newFolder(distPath)) {
    buildCss(stylesPath, path.join(distPath, 'style.css'));
  }
}

makingDistFolder();
