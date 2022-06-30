const { merge } = require('webpack-merge');

module.exports = (config, context) => {
  return merge(config, {
    module: {
      rules: [
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: [{ loader: '@svgr/webpack', options: { SVGO: true } }, { loader: 'url-loader' }],
        },
      ],
    },
  });
};
