var webpack = require('webpack');

module.exports = {
  target: 'node-webkit',
  entry: [
    './src/APIBlueprintImporter.js',
  ],
  output: {
    filename: 'APIBlueprintImporter.js',
    path: './build/io.apiary.PawExtensions.APIBlueprintImporter'
  },
  module: {
    noParse: /node_modules\/drafter.js/,
    loaders: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
      }
    ]
  }
}
