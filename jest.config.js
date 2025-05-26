module.exports = {
  preset: 'jest-expo',
  setupFiles: ['<rootDir>/jest.setup.js'],   // <-- ajoute cette ligne
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|expo|@expo|@unimodules|sentry-expo|@sentry|@react-navigation|react-navigation|@react-native-async-storage|@expo/vector-icons)/"
  ],
};
