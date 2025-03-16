module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",

    // Ensure Jest picks up test files only inside each service's __tests__ directory
    testMatch: [
        "<rootDir>/services/user-service/src/__tests__/**/*.test.ts",
        "<rootDir>/services/booking-service/__tests__/**/*.test.ts"
    ],

    // Automatically clears mocks before each test to avoid state leakage
    clearMocks: true,

    // Enable test coverage reporting
    collectCoverage: true,

    // Store test coverage reports in a dedicated directory
    coverageDirectory: "<rootDir>/coverage",

    // Ignore test coverage for non-source files
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/services/shared/"
    ],

    // Ensure proper module resolution for workspaces
    moduleDirectories: ["node_modules", "<rootDir>/services/shared"],

    // Ensure global Jest setup is executed before tests run
    setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

    transform: {
        "^.+\\.tsx?$": ["ts-jest", {
            tsconfig: "<rootDir>/services/user-service/tsconfig.json", // Ensure this points to the correct tsconfig
            isolatedModules: true
        }]
    }
};
