const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/Init.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'car-vr.js'
    
  },
  resolve: {
    modules: [
        'node_modules',
        path.resolve(__dirname, 'src')
      ],
      extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  }
};