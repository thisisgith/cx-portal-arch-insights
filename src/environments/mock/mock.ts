import {
	ACCScenarios,
	ACCUserInfoScenarios,
	ActionScenarios,
	AdvisorySecurityAdvisoryScenarios,
	AfmScenarios,
	AssetScenarios,
	ATXScenarios,
	BookmarkScenarios,
	CalendarScenarios,
	CancelATXScenarios,
	CaseScenarios,
	CGTScenarios,
	ContractScenarios,
	CoverageScenarios,
	CreateRegistrationScenarios,
	CriticalBugScenarios,
	CriticalBugAssetsScenarios,
	DevicePoliciesScenarios,
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
	OSVScenarios,
	PolicesScenarios,
	RacetrackScenarios,
	RMAScenarios,
	RoleScenarios,
	SearchScenarios,
	SecurityAdvisoryBulletinScenarios,
	SecurityAdvisoryLastUpdatedCountScenarios,
	SecurityAdvisoryScenarios,
	SecurityAdvisorySeverityCountScenarios,
	SecurityAdvisorySummaryScenarios,
	SecurityAdvisoryTopScenarios,
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
	ATXResponseModel,
	AdvisoriesByLastUpdatedCount,
	Assets,
	AssetRecommendationsResponse,
	BugImpactedAssetsResponse,
	CDCSearchResponse,
	CSDFResponseModel,
	CommunitiesResponse,
	ContractQuota,
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
	FieldNoticeUpdatedResponse,
	GroupTrainingEntitySchema,
	HardwareEOLBulletinResponse,
	HardwareEOLCountResponse,
	HardwareEOLResponse,
	HardwareResponse,
	IERegistrationResponseModel,
	LicenseDataResponseModel,
	PitstopActionUpdateResponse,
	PoliciesGroupByDayInAMonthModel,
	RacetrackResponse,
	RoleCountResponse,
	SecurityAdvisoriesResponse,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryImpactCountResponse,
	SecurityAdvisoryResponse,
	SecurityAdvisorySeverityCountResponse,
	SecurityAdvisorySummary,
	ServiceInfoResponse,
	SoftwareProfilesResponse,
	SoftwareVersionsResponse,
	SoftwareEOLResponse,
	SoftwareEOLBulletinResponse,
	SuccessPathsResponse,
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
	AssetRecommendationsResponse |
	BugImpactedAssetsResponse |
	ATXResponseModel |
	CDCSearchResponse |
	CommunitiesResponse |
	ContractQuota[] |
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
	FieldNoticeUpdatedResponse |
	GroupTrainingEntitySchema |
	HardwareEOLBulletinResponse |
	HardwareEOLCountResponse |
	HardwareEOLResponse |
	HardwareResponse |
	IERegistrationResponseModel |
	LicenseDataResponseModel |
	PitstopActionUpdateResponse |
	PoliciesGroupByDayInAMonthModel |
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
	SoftwareProfilesResponse |
	SoftwareVersionsResponse |
	SoftwareEOLResponse |
	SoftwareEOLBulletinResponse |
	SoftwareEOLResponse |
	SuccessPathsResponse |
	UserTraining[] |
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
		ATXScenarios,
		ActionScenarios,
		AdvisorySecurityAdvisoryScenarios,
		AfmScenarios,
		AssetScenarios,
		BookmarkScenarios,
		CGTScenarios,
		CalendarScenarios,
		CancelATXScenarios,
		CaseScenarios,
		ContractScenarios,
		CoverageScenarios,
		CreateRegistrationScenarios,
		CriticalBugAssetsScenarios,
		CriticalBugScenarios,
		DNACStatusScenarios,
		DevicePoliciesScenarios,
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
		OSVScenarios,
		RMAScenarios,
		PolicesScenarios,
		RMAScenarios,
		RacetrackScenarios,
		RoleScenarios,
		SearchScenarios,
		SecurityAdvisoryBulletinScenarios,
		SecurityAdvisoryLastUpdatedCountScenarios,
		SecurityAdvisoryScenarios,
		SecurityAdvisorySeverityCountScenarios,
		SecurityAdvisorySummaryScenarios,
		SecurityAdvisoryTopScenarios,
		SecurityAdvisoryTopScenarios,
		SerialNumberScenarios,
		SoftwareEOLBulletinScenarios,
		SoftwareEOLScenarios,
		SuccessPathScenarios,
		VulnerabilityScenarios,
	]),
};
