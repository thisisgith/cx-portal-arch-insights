import {
	ACCScenarios,
	ACCUserInfoScenarios,
	ActionScenarios,
	AdvisorySecurityAdvisoryScenarios,
	AssetScenarios,
	ATXScenarios,
	CaseScenarios,
	CGTScenarios,
	ContractScenarios,
	CoverageScenarios,
	CriticalBugScenarios,
	ELearningScenarios,
	EntitlementScenarios,
	FieldNoticeAdvisoryScenarios,
	FieldNoticeBulletinScenarios,
	FieldNoticeCountScenarios,
	FieldNoticeScenarios,
	HardwareEOLBulletinScenarios,
	HardwareEOLCountScenarios,
	HardwareEOLScenarios,
	HardwareScenarios,
	HealthStatusScenarios,
	NetworkScenarios,
	RacetrackScenarios,
	RMAScenarios,
	RoleScenarios,
	SearchScenarios,
	SecurityAdvisoryBulletinScenarios,
	SecurityAdvisoryLastUpdatedCountScenarios,
	SecurityAdvisorySeverityCountScenarios,
	SecurityAdvisoryTopScenarios,
	SecurityAdvisoryScenarios,
	SecurityAdvisorySummaryScenarios,
	SerialNumberScenarios,
	SuccessPathScenarios,
	UserScenarios,
	VulnerabilityScenarios,
} from './';

import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash-es';

import {
	ACCResponse,
	ACCUserInfoSchema,
	AdvisoriesByLastUpdatedCount,
	Assets,
	ATXResponse,
	CDCSearchResponse,
	CommunitiesResponse,
	CoverageCountsResponse,
	CoverageResponse,
	CriticalBugsCount,
	CriticalBugsResponse,
	DeviceContractResponse,
	ELearningResponse,
	EntitledUser,
	FieldNoticeAdvisoryResponse,
	FieldNoticeBulletinResponse,
	FieldNoticeResponse,
	GroupTrainingEntitySchema,
	FieldNoticeUpdatedResponse,
	HardwareEOLBulletinResponse,
	HardwareEOLCountResponse,
	HardwareEOLResponse,
	HardwareResponse,
	PitstopActionUpdateResponse,
	RacetrackResponse,
	RoleCountResponse,
	SecurityAdvisoriesResponse,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryImpactCountResponse,
	SecurityAdvisoryResponse,
	SecurityAdvisorySeverityCountResponse,
	SecurityAdvisorySummary,
	ServiceInfoResponse,
	SuccessPathsResponse,
	UserQuota,
	UserTraining,
	VulnerabilityResponse,
} from '@sdp-api';

import { RMAResponse } from '@interfaces';

/** Alias type for the Response Body */
type ResponseBody = (
	ACCResponse |
	ACCUserInfoSchema |
	AdvisoriesByLastUpdatedCount |
	Assets |
	ATXResponse |
	CDCSearchResponse |
	CommunitiesResponse |
	CoverageCountsResponse |
	CoverageResponse |
	CriticalBugsCount |
	CriticalBugsResponse |
	DeviceContractResponse |
	ELearningResponse |
	EntitledUser |
	FieldNoticeAdvisoryResponse |
	FieldNoticeBulletinResponse |
	FieldNoticeResponse |
	GroupTrainingEntitySchema |
	FieldNoticeUpdatedResponse |
	HardwareEOLBulletinResponse |
	HardwareEOLCountResponse |
	HardwareEOLResponse |
	HardwareResponse |
	PitstopActionUpdateResponse |
	RacetrackResponse |
	RMAResponse |
	RoleCountResponse |
	SecurityAdvisoriesResponse |
	SecurityAdvisoryBulletinResponse |
	SecurityAdvisoryImpactCountResponse |
	SecurityAdvisoryResponse |
	SecurityAdvisorySeverityCountResponse |
	SecurityAdvisorySummary |
	ServiceInfoResponse |
	SuccessPathsResponse |
	UserQuota |
	UserTraining |
	VulnerabilityResponse |
	VulnerabilityResponse
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
		ActionScenarios,
		AdvisorySecurityAdvisoryScenarios,
		AssetScenarios,
		ATXScenarios,
		CaseScenarios,
		CGTScenarios,
		ContractScenarios,
		CoverageScenarios,
		CriticalBugScenarios,
		ELearningScenarios,
		EntitlementScenarios,
		FieldNoticeAdvisoryScenarios,
		FieldNoticeBulletinScenarios,
		FieldNoticeCountScenarios,
		FieldNoticeScenarios,
		HardwareEOLBulletinScenarios,
		HardwareEOLCountScenarios,
		HardwareEOLScenarios,
		HardwareScenarios,
		HealthStatusScenarios,
		NetworkScenarios,
		RacetrackScenarios,
		RMAScenarios,
		RoleScenarios,
		SearchScenarios,
		SecurityAdvisoryBulletinScenarios,
		SecurityAdvisoryLastUpdatedCountScenarios,
		SecurityAdvisoryTopScenarios,
		SecurityAdvisoryScenarios,
		SecurityAdvisorySeverityCountScenarios,
		SecurityAdvisorySummaryScenarios,
		SecurityAdvisoryTopScenarios,
		SerialNumberScenarios,
		SuccessPathScenarios,
		UserScenarios,
		VulnerabilityScenarios,
	]),
};
