import {
	ACCScenarios,
	ACCUserInfoScenarios,
	ActionScenarios,
	AdvisorySecurityAdvisoryScenarios,
	AfmScenarios,
	ArchitectureScenarios,
	ASDAcceptEulaScenarios,
	ASDAcceptK9Scenarios,
	ASDImageDownloadUrlScenarios,
	ASDMetadataScenarios,
	ASDTokenScenarios,
	AssetScenarios,
	AssetSummaryScenarios,
	ATXScenarios,
	BookmarkScenarios,
	CalendarScenarios,
	CancelATXScenarios,
	CaseScenarios,
	CGTScenarios,
	ComplianceScenarios,
	ContractScenarios,
	CoverageScenarios,
	CreateRegistrationScenarios,
	CriticalBugAssetsScenarios,
	CriticalBugScenarios,
	DevicePoliciesScenarios,
	DeviceScenarios,
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
	RCCScenarios,
	RiskScenarios,
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
	RccAssetFilterResponse,
	RoleCountResponse,
	SecurityAdvisoriesResponse,
	SecurityAdvisoryBulletinResponse,
	SecurityAdvisoryImpactCountResponse,
	SecurityAdvisoryResponse,
	SecurityAdvisorySeverityCountResponse,
	SecurityAdvisorySummary,
	ServiceInfoResponse,
	SoftwareGroupsResponse,
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
	RccAssetFilterResponse |
	SecurityAdvisoriesResponse |
	SecurityAdvisoryBulletinResponse |
	SecurityAdvisoryImpactCountResponse |
	SecurityAdvisoryResponse |
	SecurityAdvisorySeverityCountResponse |
	SecurityAdvisorySummary |
	ServiceInfoResponse |
	SoftwareGroupsResponse |
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
		ArchitectureScenarios,
		AfmScenarios,
		ASDAcceptEulaScenarios,
		ASDAcceptK9Scenarios,
		ASDImageDownloadUrlScenarios,
		ASDMetadataScenarios,
		ASDTokenScenarios,
		AssetScenarios,
		AssetSummaryScenarios,
		ATXScenarios,
		BookmarkScenarios,
		CGTScenarios,
		CalendarScenarios,
		CancelATXScenarios,
		CaseScenarios,
		ComplianceScenarios,
		ContractScenarios,
		CoverageScenarios,
		CreateRegistrationScenarios,
		CriticalBugAssetsScenarios,
		CriticalBugScenarios,
		DNACStatusScenarios,
		DeviceScenarios,
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
		RiskScenarios,
		RMAScenarios,
		RacetrackScenarios,
		RCCScenarios,
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
