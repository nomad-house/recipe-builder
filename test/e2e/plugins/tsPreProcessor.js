const webpack = require('@cypress/webpack-preprocessor');

module.exports = on => {
  const webpackConfig = {
    webpackOptions: {
      resolve: {
        extensions: ['.ts', '.js']
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            exclude: [/node_modules/],
            use: [
              {
                loader: 'ts-loader'
              }
            ]
          }
        ]
      }
    }
  };

  on('file:preprocessor', webpack(webpackConfig));
};
