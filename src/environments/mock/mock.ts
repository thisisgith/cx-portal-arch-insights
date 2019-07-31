import {
	ACCScenarios,
	ACCUserInfoScenarios,
	ActionScenarios,
	AssetScenarios,
	ATXScenarios,
	CaseScenarios,
	ContractScenarios,
	CoverageScenarios,
	ELearningScenarios,
	HardwareEOLBulletinScenarios,
	HardwareEOLCountScenarios,
	HardwareEOLScenarios,
	HardwareScenarios,
	NetworkScenarios,
	SerialNumberScenarios,
	RacetrackScenarios,
	RMAScenarios,
	RoleScenarios,
	SearchScenarios,
	SecurityAdvisoryBulletinScenarios,
	SecurityAdvisoryScenarios,
	SecurityAdvisoryTopScenarios,
	SecurityAdvisorySummaryScenarios,
	SuccessPathScenarios,
	FieldNoticeScenarios,
	FieldNoticeBulletinScenarios,
	HealthStatusScenarios,
	PolicesScenarios,
	DevicePolicesScenarios,
	VulnerabilityScenarios,
	UserScenarios,
} from './';

import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash-es';

import {
	ACCResponse,
	ACCUserInfoSchema,
	Assets,
	ATXResponse,
	CDCSearchResponse,
	CommunitiesResponse,
	CoverageCountsResponse,
	CoverageResponse,
	ELearningResponse,
	FieldNoticeBulletinResponse,
	FieldNoticeResponse,
	HardwareEOLBulletinResponse,
	HardwareEOLCountResponse,
	HardwareEOLResponse,
	HardwareResponse,
	PitstopActionUpdateResponse,
	RacetrackResponse,
	RoleCountResponse,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryImpactCountResponse,
	SecurityAdvisoryResponse,
	SecurityAdvisorySummary,
	SuccessPathsResponse,
	VulnerabilityResponse,
	DeviceContractResponse,
} from '@sdp-api';
// } from '../';

import { RMAResponse } from '@interfaces';

/** Alias type for the Response Body */
type ResponseBody = (
	ACCResponse |
	ACCUserInfoSchema |
	Assets |
	ATXResponse |
	CDCSearchResponse |
	CommunitiesResponse |
	CoverageCountsResponse |
	CoverageResponse |
	ELearningResponse |
	FieldNoticeBulletinResponse |
	FieldNoticeResponse |
	HardwareEOLBulletinResponse |
	HardwareEOLCountResponse |
	HardwareEOLResponse |
	HardwareResponse |
	PitstopActionUpdateResponse |
	RacetrackResponse |
	RMAResponse |
	RoleCountResponse |
	SecurityAdvisoryBulletinResponse |
	SecurityAdvisoryImpactCountResponse |
	SecurityAdvisoryResponse |
	SecurityAdvisorySummary |
	SuccessPathsResponse |
	VulnerabilityResponse |
	DeviceContractResponse
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
		ACCUserInfoScenarios,
		ATXScenarios,
		ActionScenarios,
		AssetScenarios,
		CaseScenarios,
		ContractScenarios,
		CoverageScenarios,
		ELearningScenarios,
		FieldNoticeBulletinScenarios,
		FieldNoticeScenarios,
		HardwareEOLBulletinScenarios,
		HardwareEOLCountScenarios,
		HardwareEOLScenarios,
		HardwareScenarios,
		SerialNumberScenarios,
		HealthStatusScenarios,
		PolicesScenarios,
		DevicePolicesScenarios,
		NetworkScenarios,
		RMAScenarios,
		RacetrackScenarios,
		RoleScenarios,
		SearchScenarios,
		SecurityAdvisoryBulletinScenarios,
		SecurityAdvisoryTopScenarios,
		SecurityAdvisoryScenarios,
		SecurityAdvisorySummaryScenarios,
		SuccessPathScenarios,
		UserScenarios,
		VulnerabilityScenarios,
	]),
};
