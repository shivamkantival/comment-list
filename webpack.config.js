const path = require('path');

module.exports = {
  entry: './js/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'main.bundle.js'
  },
  resolve: {
    modules: [path.resolve(__dirname, 'js'), 'node_modules']
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              ['transform-class-properties', 'transform-runtime', {
                helpers: false,
                polyfill: false,
                regenerator: true,
                moduleName: 'babel-runtime',
              }],
            ],
          },
        },
      },
    ],
  },
};