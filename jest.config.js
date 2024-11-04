module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverage: true,
    moduleNameMapper: {
        '^prisma/(.*)$': '<rootDir>/prisma/$1',
    },
    moduleDirectories: ['node_modules', 'src', '<rootDir>'],
    coverageDirectory: './coverage',
};