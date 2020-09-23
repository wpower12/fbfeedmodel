const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  mode: 'development',
  output: {
    filename: 'fbfeedbundle.js',
    path: path.resolve(__dirname, 'dist/js')
  }
};