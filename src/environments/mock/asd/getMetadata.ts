/** base API */
const api = '/software/preview/v3.0/metadata/udi/PID%3A+CAAPL-BCSP-1.0-K9VID%3A+V01%2C+' +
	'SN%3A+00000001/mdf_id/286324649/software_type_id/286324666/current_release/0.0.1';

/**
 * Mock body of results for successful DNAC call
 */
const mockData  = {
	metadata_response: {
		asd_metadata_exception: null,
		metadata_mdfid_list: [
			{
				mdf_concept_name: 'CX Collector',
				mdf_id: '286324649',
				software_response_list: [
					{
						platform_list: [
							{
								operating_platform: null,
								release_list: [
									{
										catalog_message: null,
										deleted_date: null,
										field_notice_url: null,
										image_details: [
											{
												asd_image_exception: [],
												deferral_notice: null,
												deleted_date: null,
												encryption_software_indicator: 'Y',
												feature_set_description: null,
												image_checksums: {
													md5_checksum: 'e0d4968f21c037987a8dc647' +
														'8c42ff70',
													sha512_checksum: '44e1ea18388350f' +
														'6fabf05081ee589aff45d578664108' +
														'e5234b96f97b13bce8c5d477a7a87e26' +
														'a3d8643672ec4a77b7dbcf1f3dcbc5dafab8' +
														'e0eec0cf4be01f3',
												},
												image_description: 'Dummy image for CX portal',
												image_guid: '68C7706DB6C727B4C70B0D5F4EFFFF64E' +
													'DD5C1C8',
												image_level_docs: [],
												image_name: 'Test_dummy.zip',
												image_size: '458189548',
												is_deleted: 'N',
												migration_release_life_cycle: null,
												migration_release_version: null,
												migration_target_retirement_date: null,
												min_dram: null,
												min_flash: null,
												related_image: 'N',
												software_advisory: null,
											},
										],
										is_deleted: 'N',
										is_suggested_rel: 'N',
										release_fcs_date: '2019-08-09',
										release_level_docs: [],
										release_life_cycle: null,
										release_message: null,
										release_version: '0.0.2',
										security_advisory: null,
									},
								],
							},
						],
						software_type_id: '286324666',
						software_type_name: 'CX Collector Software',
					},
				],
			},
		],
		metadata_trans_id: '1178782699',
		udi: 'PID:+CAAPL-BCSP-1.0-K9VID:+V01,+SN:+00000001',
	},
	pagination_response_record: {
		last_index: 1,
		page_index: 1,
		page_records: 1,
		self_link: 'https://api.cisco.com/software/preview/v3.0/metadata/udi/PID:+CAAPL-' +
			'BCSP-1.0-K9VID:+V01,+SN:+00000001/mdf_id/286324649/software_type_id/286324666/' +
			'current_release/0.0.1?page_index=1',
		title: 'Get Metadata by UDI, MDF ID, Software Type ID, Current Release - Download API',
		total_records: 1,
	},
	service_status: {
		asd_service_response_exception: null,
		status: 'success',
	},
};

/**
 * The scenarios
 */
export const ASDMetadataScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 500,
					description: 'Get Metadata',
					response: {
						body: mockData,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: api,
		usecases: ['ASD'],
	},
];
