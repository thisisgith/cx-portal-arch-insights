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
	CreateRegistrationScenarios,
	CriticalBugScenarios,
	DNACStatusScenarios,
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
	LicenseScenarios,
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
	SoftwareEOLBulletinScenarios,
	SoftwareEOLScenarios,
	SuccessPathScenarios,
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
	CSDFResponseModel,
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
	LicenseDataResponseModel,
	IERegistrationResponseModel,
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
	SoftwareEOLResponse,
	SoftwareEOLBulletinResponse,
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
	CSDFResponseModel |
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
	LicenseDataResponseModel |
	IERegistrationResponseModel |
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
	SoftwareEOLResponse |
	SoftwareEOLBulletinResponse |
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
		CreateRegistrationScenarios,
		CriticalBugScenarios,
		DNACStatusScenarios,
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
		LicenseScenarios,
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
		SoftwareEOLScenarios,
		SoftwareEOLBulletinScenarios,
		SuccessPathScenarios,
		VulnerabilityScenarios,
	]),
};
