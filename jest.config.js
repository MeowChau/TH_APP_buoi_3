module.exports = {
  preset: '@react-native/jest-preset',
  cacheDirectory: '<rootDir>/.cache/jest',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|phosphor-react-native)/)',
  ],
};
