const fs = require('fs')
const path = require('path')
const dirs = fs.readdirSync(__dirname)

/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  verbose: true,
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testMatch: ['**/src/**/*.test.[jt]s?(x)'],
  testEnvironment: 'jsdom',
  // 忽略除了 src 目录之外的文件,以及 stories 文件的修改
  watchPathIgnorePatterns: dirs
    .filter(name => name !== 'src')
    .map(name => path.join(__dirname, name))
    .concat('stories\\.tsx'),
}

module.exports = config
