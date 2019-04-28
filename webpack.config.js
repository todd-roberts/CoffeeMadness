const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './lib/client/game.js',
  mode: 'development',
  resolve: {
    modules: [
      path.resolve('./lib'),
      path.resolve('./node_modules')
    ],
    extensions: ['.js']
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          },
        },
      ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
};