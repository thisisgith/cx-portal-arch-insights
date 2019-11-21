import {
	ACCScenarios,
	AdminComplience,
	ACCUserInfoScenarios,
	ActionScenarios,
	AdvisorySecurityAdvisoryScenarios,
	ArchitectureReviewScenarios,
	ArchitectureScenarios,
	ASDAcceptEulaScenarios,
	ASDAcceptK9Scenarios,
	ASDImageDownloadUrlScenarios,
	ASDMetadataScenarios,
	ASDTokenScenarios,
	AssetLinkScenarios,
	AssetScenarios,
	AssetSummaryScenarios,
	AssetTaggingScenarios,
	ATXScenarios,
	BookmarkScenarios,
	CalendarScenarios,
	CancelATXScenarios,
	CaseScenarios,
	CGTScenarios,
	ComparisonViewScenarios,
	ComplianceScenarios,
	ContractScenarios,
	ControlpointAssetsScenarios,
	CoverageScenarios,
	CreateRegistrationScenarios,
	CriticalBugAssetsScenarios,
	CriticalBugScenarios,
	DevicePoliciesScenarios,
	DeviceScenarios,
	DNACStatusScenarios,
	ELearningScenarios,
	EntitlementScenarios,
	FeedbackScenarios,
	FieldNoticeAdvisoryScenarios,
	FieldNoticeBulletinScenarios,
	FieldNoticeCountScenarios,
	FieldNoticeScenarios,
	HardwareAssetScenarios,
	HardwareEOLBulletinScenarios,
	HardwareEOLCountScenarios,
	HardwareEOLScenarios,
	HardwareScenarios,
	HealthStatusScenarios,
	InsightsScenarios,
	LicenseScenarios,
	NetworkScenarios,
	OSVScenarios,
	PartnerInfoScenarios,
	PolicesScenarios,
	RacetrackScenarios,
	RCCScenarios,
	RegisterATXScenarios,
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
	SyslogScenarios,
	SystemAssetScenarios,
	VulnerabilityScenarios,
} from './';

import { HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash-es';

import {
	ACCResponse,
	ACCUserInfoSchema,
	AdvisoriesByLastUpdatedCount,
	AssetRecommendationsResponse,
	Assets,
	ATXResponseModel,
	BugImpactedAssetsResponse,
	CDCSearchResponse,
	CommunitiesResponse,
	CompanyInfoList,
	ContractQuota,
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
	FieldNoticeUpdatedResponse,
	GroupTrainingEntitySchema,
	HardwareAssets,
	HardwareEOLBulletinResponse,
	HardwareEOLCountResponse,
	HardwareEOLResponse,
	HardwareResponse,
	IERegistrationResponseModel,
	InsightsResponse,
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
	SoftwareEOLBulletinResponse,
	SoftwareEOLResponse,
	SoftwareGroupAssetsResponse,
	SoftwareGroupsResponse,
	SoftwareGroupVersionsResponse,
	SoftwareVersionsResponse,
	SuccessPathsResponse,
	SystemAssets,
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
	CompanyInfoList |
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
	HardwareAssets |
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
	SystemAssets |
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
		AdminComplience,
		ACCUserInfoScenarios,
		ActionScenarios,
		AdvisorySecurityAdvisoryScenarios,
		ArchitectureReviewScenarios,
		ArchitectureScenarios,
		ASDAcceptEulaScenarios,
		ASDAcceptK9Scenarios,
		ASDImageDownloadUrlScenarios,
		ASDMetadataScenarios,
		ASDTokenScenarios,
		AssetLinkScenarios,
		AssetScenarios,
		AssetSummaryScenarios,
		AssetTaggingScenarios,
		ATXScenarios,
		BookmarkScenarios,
		CalendarScenarios,
		CancelATXScenarios,
		CaseScenarios,
		CGTScenarios,
		ComparisonViewScenarios,
		ComplianceScenarios,
		ContractScenarios,
		ControlpointAssetsScenarios,
		CoverageScenarios,
		CreateRegistrationScenarios,
		CriticalBugAssetsScenarios,
		CriticalBugScenarios,
		DevicePoliciesScenarios,
		DeviceScenarios,
		DNACStatusScenarios,
		ELearningScenarios,
		EntitlementScenarios,
		FeedbackScenarios,
		FieldNoticeAdvisoryScenarios,
		FieldNoticeBulletinScenarios,
		FieldNoticeCountScenarios,
		FieldNoticeScenarios,
		HardwareAssetScenarios,
		HardwareEOLBulletinScenarios,
		HardwareEOLCountScenarios,
		HardwareEOLScenarios,
		HardwareScenarios,
		HealthStatusScenarios,
		InsightsScenarios,
		LicenseScenarios,
		NetworkScenarios,
		OSVScenarios,
		PartnerInfoScenarios,
		PolicesScenarios,
		RacetrackScenarios,
		RCCScenarios,
		RegisterATXScenarios,
		RiskScenarios,
		RMAScenarios,
		RMAScenarios,
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
		SyslogScenarios,
		SystemAssetScenarios,
		VulnerabilityScenarios,
	]),
};
