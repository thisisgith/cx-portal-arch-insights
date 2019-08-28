// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

/**
 * Require is used by karma to load spec files
 */
declare const require: any; // tslint:disable-line:no-any

// First, initialize the Angular testing environment.
getTestBed()
	.initTestEnvironment(
		BrowserDynamicTestingModule,
		platformBrowserDynamicTesting(),
);

/**
 * context represents all of the tests found via require
 */
const context = require.context('./', true, /\.spec\.ts$/);

// And load the modules.
context.keys()
	.map(context);
