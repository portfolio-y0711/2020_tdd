module.exports = {
    roots: ["<rootDir>/__tests__"],
    transform: {
      "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    testPathIgnorePatterns: ["/node_modules/"],
    // moduleFileExtensions: [
    //     "ts",
    //     "tsx",
    //     "js",
    //     "jsx",
    //     "json",
    //     "node"
    // ],
    // collectCoverage: true
    globalSetup: "./src/test-utils/setup-db.ts",
    setupFilesAfterEnv: ["./src/test-utils/db-env.ts"],
  };
  