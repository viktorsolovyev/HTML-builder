const fsPromises = require("fs/promises");
const path = require("path");

const stylesFolderPath = path.join(__dirname, "styles");
const assetsFolderPath = path.join(__dirname, "assets");
const componentsFolderPath = path.join(__dirname, "components");
const distFolderPath = path.join(__dirname, "project-dist");
const bundleFilePath = path.join(distFolderPath, "style.css");
const indexFilePath = path.join(distFolderPath, "index.html");
const templateFilePath = path.join(__dirname, "template.html");

async function deepCopyFolder (srcPath, destPath) {
    await fsPromises.mkdir(destPath, { recursive: true });

    let files = await fsPromises.readdir(srcPath, { withFileTypes: true });

    for (let file of files) {
      if (file.isFile()) {
        await fsPromises.copyFile(path.join(srcPath, file.name), path.join(destPath, file.name));
      } else {
        await deepCopyFolder(path.join(srcPath, file.name), path.join(destPath, file.name));
      }
    }
}

async function createBundleCSS (srcPath, destPath) {   
    const bundleArray = [];
    const files = await fsPromises.readdir(srcPath, { withFileTypes: true });

    for (let file of files) {
        if (file.isFile() && path.parse(file.name).ext == ".css") {
            let contents = await fsPromises.readFile(path.join(srcPath, file.name), { encoding: 'utf8' });
            bundleArray.push(contents);
        }
    }
    
    await fsPromises.open(destPath, "w");
    
    for (let style of bundleArray){
        await fsPromises.appendFile(destPath, style);
    }

}

async function createIndexHTML (srcFolderPath, tempFilePath, destFilePath) {       
    let indexString = await fsPromises.readFile(tempFilePath, { encoding: 'utf8' });
    const files = await fsPromises.readdir(srcFolderPath, { withFileTypes: true });

    for (let file of files) {
        
        let fileDetails = path.parse(file.name);
        if (file.isFile() && fileDetails.ext == ".html") {
            let contents = await fsPromises.readFile(path.join(srcFolderPath, fileDetails.base), { encoding: 'utf8' });
            indexString = indexString.replace(`{{${fileDetails.name}}}`, contents);        
        }
    }
    
   await fsPromises.open(destFilePath, "w");  
   await fsPromises.writeFile(destFilePath, indexString);

}

async function buildPage() {
  
  await fsPromises.rm(distFolderPath, {recursive: true, force: true});
  await fsPromises.mkdir(distFolderPath, {recursive: true});
  await deepCopyFolder(assetsFolderPath, path.join(distFolderPath, "assets"));
  await createBundleCSS(stylesFolderPath, bundleFilePath);
  await createIndexHTML(componentsFolderPath, templateFilePath, indexFilePath);

}

buildPage();
