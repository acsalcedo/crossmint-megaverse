
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).ts', // Only include .ts test files
  ],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
