const fs = require(`fs`);
const path = require(`path`);
const chokidar = require('chokidar');
// Initialize watcher.
const assetWatcher = chokidar.watch('./src/(posts|talks)/**/*.{pdf,jpg,jpeg,png,gif,webp}', { persistent: true });

/**
 * @param {String} imagePath
 */
async function copyAssetToPublicDir(imagePath) {
  if (!imagePath.startsWith('src/')) {
    throw new Error('Watch Images Error: This command is to be executed from the base directory.');
  }
  const src = imagePath;
  const dest = 'public/' + src.replace('src/', '').replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}-/, '');
  await fs.promises.mkdir(path.dirname(dest), { recursive: true });
  await fs.promises.copyFile(src, dest);
  console.log('copied image to ' + dest);
}

assetWatcher
  .on('add', copyAssetToPublicDir)
  .on('change', copyAssetToPublicDir)
  .on('unlink', (path) => console.log(`File ${path} has been removed`));
// TODO: implement removing image file
