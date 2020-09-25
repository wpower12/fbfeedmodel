const path = require('path');

module.exports = {
  entry: './src/js/main.js',
  mode: 'development',
  // rules: [
  //             {
  //                 loader: 'ify-loader'
  //             }
  //         ],
  output: {
    filename: 'fbfeedbundle.js',
    path: path.resolve(__dirname, 'dist/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'ify-loader',
          'transform-loader?plotly.js/tasks/compress_attributes.js',
          ]
      },
    ]
  }
};