const { merge } = require('webpack-merge');
const nxWebpack = require('@nrwl/react/plugins/webpack');

module.exports = {
  stories: [],
  addons: ['@storybook/addon-essentials'],
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config, context) => {
    const newConfig = nxWebpack(config, context);

    newConfig.module.rules = newConfig.module.rules.filter((rule) => {
      // remove svg rules, so we can add our own config
      return !rule.test.toString().includes('.svg');
    });

    return merge(newConfig, {
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
  },
};
