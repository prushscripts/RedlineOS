const sharp = require('sharp')
const fs = require('fs')

const svgBuffer = fs.readFileSync('./public/favicon.svg')

sharp(svgBuffer)
  .resize(32, 32)
  .png()
  .toFile('./public/favicon-32.png')
  .then(() => console.log('Favicon PNG generated'))
