// jest.config.js
const { pathsToModuleNameMapper } = require("ts-jest/utils");
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const { compilerOptions } = require("./tsconfig.json");

module.exports = {
	roots: ["<rootDir>/src/app"],
  globals: {
    "ts-jest": {
      tsConfig: "<rootDir>/tsconfig.spec.json",
      stringifyContentPathRegex: '\\.html$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer'
      ],
    }
  },
  preset: "jest-preset-angular",
  setupFiles: [
    "<rootDir>/jest.stub.js"
  ],
  setupFilesAfterEnv: [
    "<rootDir>/setupJest.js"
  ],
  testEnvironment: 'jest-environment-jsdom-fourteen',
  transform: {
    "^.+\\.(ts|html)$": "ts-jest",
    "^.+\\.js$": "babel-jest"
  },
  transformIgnorePatterns: [
    "node_modules/(?!(lodash-es)/)"
  ],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js',
  ],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/*.ts',
    '!**/index.ts',
    '!src/app/**/*-routing.module.ts',
    '!src/app/components/racetrack/racetrack.component.ts',
    '!src/app/pages/solution/syslogs/syslogs.utils.ts',
    '!src/app/pages/admin/admin.module.ts',
    '!src/app/components/user-mgmt/user-mgmt.component.ts',
    '!src/app/components/user-mgmt/select-role/select-role.component.ts',
    '!src/app/components/user-mgmt/select-role/roles.service.ts',
    '!src/app/components/user-mgmt/user-mgmt-sort.pipe.ts',
    '!src/app/components/user-mgmt/user-mgmt-filter.pipe.ts',
    '!src/app/pipes/assets/assets.pipe.module.ts',
    '!src/app/components/search/serial-search/serial-search.component.ts',
    '!src/app/pages/solution/lifecycle/atx-watch-modal/atx-watch-modal.component.ts',
  ],
  coverageThreshold: {
    'global': {
      'branches': 50,
      'functions': 75,
      'lines': 75,
      'statements': 75
    },
    'src/**/*.ts': {
      'branches': 50,
      'functions': 50,
      'lines': 50,
      'statements': 50      
    }
  },
  coverageReporters: [ 
    'json', 
    'lcov', 
    'text', 
    'text-summary',
    'clover',
  ],
  coverageDirectory: '<rootDir>/coverage',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' })
};
