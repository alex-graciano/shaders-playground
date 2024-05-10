const path = require('path');

module.exports = {
  entry: './public/sketch.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  mode: 'development',
  devServer: {
    static: {
        directory: path.join(__dirname, 'public'),
    }, 
    compress: true,
    port: 8080,
    open: true,
    historyApiFallback: {
        index: 'sketch.html'
    }
  },
  devtool: "source-map"
};