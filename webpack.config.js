const path = require('path');

module.exports = {
  entry: './src/Test.ts',
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(vert|frag)$/,
        loader: 'shader-loader',
        options: {
          glsl: {
            chunkPath: path.resolve(__dirname, "/glsl/chunks")
          }
        }
      }      
    ]
  },
  resolve: {
    extensions: [ ".tsx", ".ts", ".js", ".vert", ".frag" ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};