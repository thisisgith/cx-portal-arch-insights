import {
	ACCScenarios,
	ATXScenarios,
	CommunitiesScenarios,
	ELearningScenarios,
	HardwareScenarios,
	RacetrackScenarios,
	searchData,
	SuccessPathScenarios,
} from './';
import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';

import {
	ACCResponse,
	ATXResponse,
	CommunitiesResponse,
	ELearningResponse,
	HardwareResponse,
	RacetrackResponse,
	SuccessPathsResponse,
} from '@cui-x/sdp-api';

import {
	SearchResults,
} from '@services';

/** Alias type for the Response Body */
type ResponseBody = (
	HardwareResponse |
	ATXResponse |
	CommunitiesResponse |
	ELearningResponse |
	SuccessPathsResponse |
	ACCResponse |
	RacetrackResponse |
	SearchResults
);

/**
 * Interface representing a scenario for a Mock test
 */
interface Scenario {
	selected?: boolean;
	description: string;
	delay?: number;
	response: {
		body?: ResponseBody;
		headers?: HttpHeaders;
		status: number;
		statusText?: string;
	};
}

/**
 * Interface Representing a mock object
 */
export interface Mock {
	url: string;
	scenarios: {
		DELETE?: Scenario[];
		GET?: Scenario[];
		HEAD?: Scenario[];
		POST?: Scenario[];
		PUT?: Scenario[];
	};
}

/**
 * Interface representing our mock settings
 */
interface MockSettings {
	mock: Mock[];
}

/**
 * Our default mock settings
 */
export const mockSettings: MockSettings = {
	mock: _.flatten([
		ACCScenarios,
		ATXScenarios,
		CommunitiesScenarios,
		ELearningScenarios,
		HardwareScenarios,
		RacetrackScenarios,
		SuccessPathScenarios,
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: searchData,
							status: 200,
						},
						selected: true,
					},
					{
						delay: 5000,
						description: 'Empty Response',
						response: {
							body: {
								results: [],
							},
							status: 200,
						},
					},
					{
						delay: 1000,
						description: 'Failure Response',
						response: {
							status: 404,
							statusText: 'Unable to find results',
						},
					},
				],
			},
			url: '/ws/search',
		},
	]),
};
