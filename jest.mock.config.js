module.exports = {
    roots: ["__tests__"],
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    // testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    testPathIgnorePatterns: [
        "/node_modules/", "__tests__/pretest/config"
    ],
    // moduleFileExtensions: [
    //     "ts",
    //     "tsx",
    //     "js",
    //     "jsx",
    //     "json",
    //     "node"
    // ],
    // collectCoverage: true
    // globalSetup: "../src/test-utils/mockDB/setup-db.ts",
    // setupFilesAfterEnv: ["../src/test-utils/mockDB/db-env.ts"],
};
