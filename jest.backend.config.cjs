module.exports = {
  displayName: 'backend',
  globals: {
    'babel-jest': {
      useESM: true,
    },
  },
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testEnvironment: 'node',
  testMatch: ['**/Testing/tests/**/backend-tests/**/*.(spec|test).js'],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(bson|mongodb|mongoose|@paralleldrive|@noble|@noble/hashes)/)'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
