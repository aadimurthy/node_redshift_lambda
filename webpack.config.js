const ZipPlugin = require('zip-webpack-plugin');
const path = require('path');
const config = {
  //what are the entry points to our functions
  entry: {
    handler: './src/index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  //how we want the output
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist/'),
    libraryTarget: 'umd',
  },
  target: 'node',
  mode: 'production',
  optimization: { minimize: false },
};
//finally zip the output directory, ready to deploy
const pluginConfig = {
  plugins: Object.keys(config.entry).map((entryName) => {
    return new ZipPlugin({
      path: path.resolve(__dirname, 'dist/'),
      filename: entryName,
      extension: 'zip',
      include: ['index.js'],
    });
  }),
};

const webpackConfig = Object.assign(config, pluginConfig);
module.exports = webpackConfig;
