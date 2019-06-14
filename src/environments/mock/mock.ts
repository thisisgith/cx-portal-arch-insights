import {
	ActionScenarios,
	ACCScenarios,
	ATXScenarios,
	CommunitiesScenarios,
	ELearningScenarios,
	HardwareScenarios,
	RacetrackScenarios,
	SearchScenarios,
	SuccessPathScenarios,
} from './';
import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';

import {
	ACCResponse,
	ATXResponse,
	PitstopActionUpdateResponse,
	CommunitiesResponse,
	ELearningResponse,
	HardwareResponse,
	RacetrackResponse,
	SuccessPathsResponse,
	CDCSearchResponse,
} from '@cui-x/sdp-api';

/** Alias type for the Response Body */
type ResponseBody = (
	HardwareResponse |
	ATXResponse |
	CommunitiesResponse |
	ELearningResponse |
	SuccessPathsResponse |
	ACCResponse |
	RacetrackResponse |
	PitstopActionUpdateResponse |
	CDCSearchResponse
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
		PATCH?: Scenario[];
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
		ActionScenarios,
		ELearningScenarios,
		HardwareScenarios,
		RacetrackScenarios,
		SuccessPathScenarios,
		SearchScenarios,
	]),
};
