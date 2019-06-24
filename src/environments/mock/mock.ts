import {
	ACCScenarios,
	ActionScenarios,
	ATXScenarios,
	CommunitiesScenarios,
	CaseScenarios,
	ContractScenarios,
	ELearningScenarios,
	HardwareScenarios,
	RacetrackScenarios,
	RMAScenarios,
	SearchScenarios,
	SuccessPathScenarios,
} from './';
import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';

import {
	ACCResponse,
	ATXResponse,
	CDCSearchResponse,
	CommunitiesResponse,
	ELearningResponse,
	HardwareResponse,
	PitstopActionUpdateResponse,
	RacetrackResponse,
	SuccessPathsResponse,
} from '@cui-x/sdp-api';
import { RMAResponse } from '@interfaces';

/** Alias type for the Response Body */
type ResponseBody = (
	ACCResponse |
	ATXResponse |
	CDCSearchResponse |
	CommunitiesResponse |
	ELearningResponse |
	HardwareResponse |
	PitstopActionUpdateResponse |
	RacetrackResponse |
	RMAResponse |
	SuccessPathsResponse
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
		ActionScenarios,
		ATXScenarios,
		CommunitiesScenarios,
		CaseScenarios,
		ContractScenarios,
		ELearningScenarios,
		HardwareScenarios,
		RacetrackScenarios,
		RMAScenarios,
		SearchScenarios,
		SuccessPathScenarios,
	]),
};
