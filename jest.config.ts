export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^src/(.*)$': '<rootDir>/src/$1',
	},
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
	modulePathIgnorePatterns: ['./dist/'],
	coveragePathIgnorePatterns: [],
	collectCoverageFrom: ['./src/**/*.ts', '!./src/**/*.test.ts'],
	coverageThreshold: {},
}
