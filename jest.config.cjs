const path = require('path');

const frontendConfig = {
  displayName: 'frontend',
  testEnvironment: 'jsdom',
  testMatch: ['**/Testing/tests/frontend-tests/**/*.(spec|test).{js,jsx}'],
  testPathIgnorePatterns: ['/backend-tests/'],
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')]
};

const backendConfig = {
  displayName: 'backend',
  testEnvironment: 'node',
  testMatch: ['**/Testing/tests/**/backend-tests/**/*.(spec|test).js'],
  transform: {
    '^.+\\.(js|mjs)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'mjs', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(bson|mongodb|mongoose|@paralleldrive|@noble|@noble/hashes)/)'
  ],
  globals: {
    'babel-jest': {
      useESM: true
    }
  },
  setupFilesAfterEnv: [path.resolve(__dirname, 'jest.setup.js')]
};

module.exports = {
  projects: [frontendConfig, backendConfig]
};
