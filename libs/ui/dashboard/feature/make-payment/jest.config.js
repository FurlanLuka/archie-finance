module.exports = {
  displayName: 'archie-dashboard-feature-make-payment',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/archie-dashboard/feature/make-payment',
};
