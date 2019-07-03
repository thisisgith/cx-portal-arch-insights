import {
	ACCScenarios,
	ActionScenarios,
	AssetScenarios,
	ATXScenarios,
	CommunitiesScenarios,
	CaseScenarios,
	ContractScenarios,
	CoverageScenarios,
	ELearningScenarios,
	HardwareScenarios,
	NetworkScenarios,
	RacetrackScenarios,
	RMAScenarios,
	RoleScenarios,
	SearchScenarios,
	SuccessPathScenarios,
	VulnerabilityScenarios,
	EOLScenarios,
} from './';
import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash-es';

import {
	ACCResponse,
	Assets,
	ATXResponse,
	CDCSearchResponse,
	CommunitiesResponse,
	ELearningResponse,
	HardwareResponse,
	PitstopActionUpdateResponse,
	RacetrackResponse,
	RoleCountResponse,
	SuccessPathsResponse,
	VulnerabilityResponse,
	CoverageResponse,
	CoverageCountsResponse,
	HardwareEOLResponseObjectDetails,
} from '@cui-x/sdp-api';
import { RMAResponse } from '@interfaces';

/** Alias type for the Response Body */
type ResponseBody = (
	ACCResponse |
	Assets |
	ATXResponse |
	CDCSearchResponse |
	CommunitiesResponse |
	CoverageResponse |
	CoverageCountsResponse |
	ELearningResponse |
	HardwareResponse |
	PitstopActionUpdateResponse |
	RacetrackResponse |
	RMAResponse |
	RoleCountResponse |
	SuccessPathsResponse |
	VulnerabilityResponse |
	HardwareEOLResponseObjectDetails
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
		AssetScenarios,
		ATXScenarios,
		CaseScenarios,
		CommunitiesScenarios,
		ContractScenarios,
		CoverageScenarios,
		ELearningScenarios,
		HardwareScenarios,
		NetworkScenarios,
		RacetrackScenarios,
		RMAScenarios,
		RoleScenarios,
		SearchScenarios,
		SuccessPathScenarios,
		VulnerabilityScenarios,
		EOLScenarios,
	]),
};
