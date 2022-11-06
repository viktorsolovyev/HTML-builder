const fsPromises = require("fs/promises");
const path = require("path");

const srcFolderPath = path.join(__dirname, "styles");
const destFolderPath = path.join(__dirname, "project-dist");
const bundleFilePath = path.join(destFolderPath, "bundle.css");

const bundleArray = [];

async function mergeStyles() {
    
    await fsPromises.rm(bundleFilePath, {recursive: true, force: true});

    let files = await fsPromises.readdir(srcFolderPath, { withFileTypes: true });
    
    for (let file of files) {
        if (file.isFile() && path.parse(file.name).ext == ".css") {            
            let contents = await fsPromises.readFile(path.join(srcFolderPath, file.name), { encoding: 'utf8' });            
            bundleArray.push(contents);
        }
    }

    await fsPromises.open(bundleFilePath, "w");

    for (let style of bundleArray){        
        await fsPromises.appendFile(bundleFilePath, style);
    }

}


mergeStyles();