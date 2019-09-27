import {
	ACCScenarios,
	ACCUserInfoScenarios,
	ASDAcceptEulaScenarios,
	ASDAcceptK9Scenarios,
	ASDImageDownloadUrlScenarios,
	ASDMetadataScenarios,
	ASDTokenScenarios,
	ATXScenarios,
	ActionScenarios,
	AdvisorySecurityAdvisoryScenarios,
	AfmScenarios,
	ArchitectureReviewScenarios,
	ArchitectureScenarios,
	AssetLinkScenarios,
	AssetScenarios,
	AssetSummaryScenarios,
	BookmarkScenarios,
	CGTScenarios,
	CalendarScenarios,
	CancelATXScenarios,
	CaseScenarios,
	ComparisonViewScenarios,
	ComplianceScenarios,
	ContractScenarios,
	CoverageScenarios,
	CreateRegistrationScenarios,
	CriticalBugAssetsScenarios,
	CriticalBugScenarios,
	DNACStatusScenarios,
	DevicePoliciesScenarios,
	DeviceScenarios,
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
	RCCScenarios,
	RMAScenarios,
	RacetrackScenarios,
	RegisterATXScenarios,
	RiskScenarios,
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
	InsightsScenarios,
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
	MachineRecommendationsResponse,
	PoliciesGroupByDayInAMonthModel,
	ProfileRecommendationsResponse,
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
	SoftwareGroupAssetsResponse,
	SoftwareGroupsResponse,
	SoftwareGroupVersionsResponse,
	SoftwareVersionsResponse,
	SoftwareEOLResponse,
	SoftwareEOLBulletinResponse,
	SuccessPathsResponse,
	UserTraining,
	VulnerabilityResponse,
	InsightsResponse,
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
	MachineRecommendationsResponse |
	PoliciesGroupByDayInAMonthModel |
	ProfileRecommendationsResponse |
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
	SoftwareGroupAssetsResponse |
	SoftwareGroupsResponse |
	SoftwareGroupVersionsResponse |
	SoftwareVersionsResponse |
	SoftwareEOLResponse |
	SoftwareEOLBulletinResponse |
	SoftwareEOLResponse |
	SuccessPathsResponse |
	UserTraining[] |
	VulnerabilityResponse |
	InsightsResponse
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
		ArchitectureReviewScenarios,
		ArchitectureScenarios,
		AfmScenarios,
		ASDAcceptEulaScenarios,
		ASDAcceptK9Scenarios,
		ASDImageDownloadUrlScenarios,
		ASDMetadataScenarios,
		ASDTokenScenarios,
		AssetLinkScenarios,
		AssetScenarios,
		AssetSummaryScenarios,
		ATXScenarios,
		BookmarkScenarios,
		CGTScenarios,
		CalendarScenarios,
		CancelATXScenarios,
		CaseScenarios,
		ComplianceScenarios,
		ComparisonViewScenarios,
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
		RegisterATXScenarios,
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
		InsightsScenarios,
	]),
};
