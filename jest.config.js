module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transformIgnorePatterns: [
    '/node_modules/(?!(react|react-dom|@radix-ui|lucide-react)/)',
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
