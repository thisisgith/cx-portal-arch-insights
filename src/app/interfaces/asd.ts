/**
 * ImageChecksums
 */
export interface ImageChecksums {
	md5_checksum: string;
	sha512_checksum: string;
}

/**
 * Image Detail
 */
export interface ImageDetail {
	asd_image_exception: any[];
	deferral_notice?: any;
	deleted_date?: any;
	encryption_software_indicator: string;
	feature_set_description?: any;
	image_checksums: ImageChecksums;
	image_description: string;
	image_guid: string;
	image_level_docs: any[];
	image_name: string;
	image_size: string;
	is_deleted: string;
	migration_release_life_cycle?: any;
	migration_release_version?: any;
	migration_target_retirement_date?: any;
	min_dram?: any;
	min_flash?: any;
	related_image: string;
	software_advisory?: any;
}

/**
 * ReleaseList
 */
export interface ReleaseList {
	catalog_message?: any;
	deleted_date?: any;
	field_notice_url?: any;
	image_details: ImageDetail[];
	is_deleted: string;
	is_suggested_rel: string;
	release_fcs_date: string;
	release_level_docs: any[];
	release_life_cycle?: any;
	release_message?: any;
	release_version: string;
	security_advisory?: any;
}

/**
 * PlatformList
 */
export interface PlatformList {
	operating_platform?: any;
	release_list: ReleaseList[];
}

/**
 * SoftwareResponseList
 */
export interface SoftwareResponseList {
	platform_list: PlatformList[];
	software_type_id: string;
	software_type_name: string;
}

/**
 * MetadataMdfidList
 */
export interface MetadataMdfidList {
	mdf_concept_name: string;
	mdf_id: string;
	software_response_list: SoftwareResponseList[];
}

/**
 * MetadataResponseObj
 */
export interface MetadataResponseObj {
	asd_metadata_exception?: any;
	metadata_mdfid_list: MetadataMdfidList[];
	metadata_trans_id: string;
	udi: string;
}

/**
 * PaginationResponseRecord
 */
export interface PaginationResponseRecord {
	last_index: number;
	page_index: number;
	page_records: number;
	self_link: string;
	title: string;
	total_records: number;
}

/**
 * ServiceStatus
 */
export interface ServiceStatus {
	asd_service_response_exception?: any;
	status: string;
}

/**
 * MetadataResponse
 */
export interface MetadataResponse {
	metadata_response: MetadataResponseObj;
	pagination_response_record: PaginationResponseRecord;
	service_status: ServiceStatus;
}

/**
 * ChildFieldDetailsType
 */
export interface ChildFieldDetailsType {
	child_field_details_type: any[];
	field_display_name?: any;
	field_display_value?: any;
	field_id?: any;
	field_name?: any;
	field_type: string;
	field_value: string;
	input_type: string;
}

/**
 * FieldDetail
 */
export interface FieldDetail {
	child_field_details_type: ChildFieldDetailsType[];
	field_display_name: string;
	field_display_value: string;
	field_id: string;
	field_name: string;
	field_type: string;
	field_value: string;
	input_type?: any;
}

/**
 * FormDetailsType
 */
export interface FormDetailsType {
	field_details: FieldDetail[];
}

/**
 * EulaFormDetails
 */
export interface EulaFormDetails {
	acceptance_web_form_url: string;
	form_details_type: FormDetailsType;
}

/**
 * ChildFieldDetailsType2
 */
export interface ChildFieldDetailsType2 {
	child_field_details_type: any[];
	field_display_name: string;
	field_display_value: string;
	field_id: string;
	field_name?: any;
	field_type: string;
	field_value: string;
	input_type: string;
}

/**
 * FieldDetail2
 */
export interface FieldDetail2 {
	child_field_details_type: ChildFieldDetailsType2[];
	field_display_name: string;
	field_display_value: string;
	field_id: string;
	field_name: string;
	field_type: string;
	field_value: string;
	input_type: string;
}

/**
 * FormDetailsType2
 */
export interface FormDetailsType2 {
	field_details: FieldDetail2[];
}

/**
 * K9FormDetailsResponse
 */
export interface K9FormDetailsResponse {
	acceptance_web_form_url: string;
	form_details_type: FormDetailsType2;
}

/**
 * AcceptanceForm
 */
export interface AcceptanceForm {
	eula_form_details: EulaFormDetails;
	k9_form_details_response: K9FormDetailsResponse;
}

/**
 * AsdDownloadAcceptanceException
 */
export interface AsdDownloadAcceptanceException {
	acceptance_form: AcceptanceForm;
}

/**
 * AsdDownloadUrlException
 */
export interface AsdDownloadUrlException {
	exception_code: string;
	exception_message: string;
}

/**
 * DownloadInfoList
 */
export interface DownloadInfoList {
	asd_download_url_exception: AsdDownloadUrlException[];
	cloud_url?: any;
	download_url?: any;
	image_full_name: string;
	image_guid: string;
	token?: any;
}

/**
 * DownloadFileUrlResponse
 */
export interface ImageDownloadUrlResponse {
	asd_download_acceptance_exception: AsdDownloadAcceptanceException[];
	asd_service_response_exception?: any;
	download_info_list: DownloadInfoList[];
	download_retry_id: string;
	download_session_id: string;
	service_status: string;
}

/**
 * AcceptK9Response
 */
export interface AcceptFormResponse {
	download_session_id: string;
	status_message: string;
	status_number: string;
}
