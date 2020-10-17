module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js'
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  testMatch: ['**/(*.)spec.(j|t)s'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/components/**/*.{ts,vue}',
    '<rootDir>/layouts/**/*.{ts,vue}',
    '<rootDir>/middleware/**/*.ts',
    '<rootDir>/pages/**/*.{ts,vue}',
    '<rootDir>/plugins/**/*.ts',
    '<rootDir>/store/**/*.ts'
  ],
  setupFiles: ['<rootDir>/test/unit/setup.ts'],
  globalSetup: '<rootDir>/test/unit/globalSetup.ts',
  globalTeardown: '<rootDir>/test/unit/globalTeardown.ts',
  // setupFilesAfterEnv: ['<rootDir>/test/unit/customMatchers.ts'],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue']
}
