import { RMAResponse } from '@interfaces';

/** Base of URL for RMA API */
const api = '/return/v1.0/returns';

/** Default RMA number */
const rmaNumber = 800000000;

/** Default SN */
const defaultSn = 'AAA';

/**
 * Mock RMA response
 * @param options Config for mock response
 * @returns response
 */
function MockRMA (
	options: { devices: number, rmaNo?: number } = { devices: 1, rmaNo: rmaNumber }): RMAResponse {
	const rma: RMAResponse = {
		APIPagination: {
			lastIndex: '1',
			pageIndex: '1',
			pageRecords: '1',
			selfLint: `https://api-stage.cisco.com${api}/rma_numbers/${options.rmaNo}`,
			title: 'Service Order RMA API',
			totalRecords: '1',
		},
		returns: {
			RmaRecord: [{
				allowPartialShipment: '',
				billToInfo: {
					address1: 'NUMBER ONE',
					address2: 'BOYCOTT DRIVE',
					address3: 'NEWTAVERN SOUTH',
					address4: '',
					city: 'REJJITH',
					country: 'GB',
					customerName: 'STARS FIRST LTD',
					postalCode: 'B77 8QJ',
					siteUseId: '61530259',
					state: '',
					stateProv: '',
				},
				caseId: '686569635',
				contractId: '92156435',
				customerRefInfo: {
					customerPONumber: '',
					customerProvidedSN: '',
					customerRefNumber: '',
					origSalesOrderNumb: '84894022',
				},
				failureClass: 'Operational Failure',
				failureCode: 'HW Fail - Power',
				laborDetails: {
					fieldEngineerArrivedTime: '',
					fieldEngineerName: '',
					fieldEngineerOnRouteTime: '',
					fieldEngineerPhone: '',
					fieldEngineerReleasedTime: '',
					laborLines: [{
						laborDispatch: 'SELECTED',
						laborDispatchOrCancellationNotes: '',
						laborScheduledTime: '2013-08-06',
						laborStatus: 'Booked',
						laborTaskNumber: '3',
						primaryProductFamily: '7500',
					}],
				},
				notes: {
					addlComments: '',
					failureDescription: `Created by SVORMA10 at 2013/08/06 12:38:22
					Created by SVORMA10 at 2013/08/06 04:45:17
					Created by SVORMA10 at 2013/08/06 04:27:37
					test`,
					fieldEngineerInstructions: `Created by SVORMA10 at 2013/08/06 12:38:22
					Created by SVORMA10 at 2013/08/06 04:45:17
					test`,
					partDeliveryInstructions: '',
					partialShipmentNote: `Created by SVORMA10 at 2013/08/06 12:38:22
					 Do Not Partial Ship`,
					specialInstructions: '',
				},
				orderDate: '2013-08-06',
				originator: 'SVORMA10',
				replacementParts: {
					partsLineDetails: [],
					trackingInfo: {
						courierList: 'UPS',
						shipDate: '',
						trackingNumber: '23652346',
					},
				},
				requestedShipDate: '2013-08-06',
				returnLines: {
					returnParts: [{
						receivedPartNo: `ASR-920-12SZ-A=${1}`,
						receivedSerialNumber: defaultSn,
						reqturnQtyReceived: '',
						returnDateReceived: 'string',
						returnDescription: `^Cisco ASR 920-12SZ-IM Router ${1}`,
						returnLineRef: '1',
						returnLineStatus: 'Awaiting Return',
						returnQtyAuth: '1',
						returnToCiscoBy: '2013-08-16',
						returnTransactionType: 'ARPRM-RETURN-UKH',
						returnWarehouse: 'BLR',
					}],
				},
				rmaNo: options.rmaNo,
				serviceLevel: 'Premium Parts & Labor - 4 Hour',
				shipToInfo: {
					ackEmail: 'mq123@cisco.com',
					ackName: 'Mack Yrn',
					ackPhone: '1455652605402',
					ackUserId: 'mackeryn',
					address1: 'TECH SUINDRA',
					address2: '',
					address3: '',
					address4: '',
					city: 'HYDERABAD',
					country: 'IN',
					customerName: 'NPQ CORPORATION',
					postalCode: '',
					shipToContactEmail: 'mq123@cisco.com',
					shipToContactName: 'Mack Yrn',
					shipToContactPhone: '997752605402',
					siteUseId: '734647093',
					state: 'AP',
					stateProv: 'AP',
				},
				status: 'In-Progress',
			}],
		},
	};

	for (let i = 0, il = options.devices; i < il; i += 1) {
		rma.returns.RmaRecord[0].replacementParts.partsLineDetails.push({
			partsDescription: `^Cisco ASR 920-12SZ-IM Router ${i}`,
			partsDispatchStatus: 'DISPATCHED',
			partsLineRef: `${i}`,
			partsLineStatus: 'Awaiting Shipping',
			partsQtyAuth: '1',
			partsqtyShipped: '',
			partsScheduledShipTime: '2013-08-06',
			partsShipDate: '',
			partsShipmentWarehouse: 'U06',
			partsTransactionType: 'ARPRM-SHIP-UKH',
			shippedPartNo: `ASR-920-12SZ-A${i}=`,
			shippedSerialID: defaultSn,
		});
	}

	return rma;
}

/**
 * Mock error response
 */
const error: RMAResponse = {
	APIError: {
		Error: [{
			errorCode: 'API_ERROR_01',
			errorDescription: 'Internal error occurred.',
			suggestedAction:
				'Mandatory input is missing. Please review your inputs.',
		}],
	},
};

/**
 * Normal response when no records exist
 */
const noRecords: RMAResponse = {
	APIError: {
		Error: [
			{
				errorCode: 'SVO_NO_RECORDS',
				errorDescription: 'No order found for the given request.',
				suggestedAction: 'No order found for the given request.',
			},
		],
	},
};

/**
 * The scenarios
 */
export const RMAScenarios = [
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'RMA with one replacement part',
					response: {
						body: MockRMA(),
						status: 200,
					},
					selected: true,
				},
				{
					delay: 30,
					description: 'RMA with no replacement parts',
					response: {
						body: MockRMA({ devices: 0 }),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'RMA with four replacement parts',
					response: {
						body: MockRMA({ devices: 4 }),
						status: 200,
					},
					selected: false,
				},
				{
					delay: 30,
					description: 'Internal Error',
					response: {
						body: error,
						status: 200,
					},
					selected: false,
				},
			],
		},
		url: `${api}/rma_numbers/${rmaNumber}`,
		usecases: ['Use Case 1'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'No records - 88346235',
					response: {
						body: noRecords,
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/rma_numbers/88346235`,
		usecases: ['RMA'],
	},
	{
		scenarios: {
			GET: [
				{
					delay: 30,
					description: 'Records for 88346234',
					response: {
						body:  MockRMA({ devices: 1, rmaNo: 88346234 }),
						status: 200,
					},
					selected: true,
				},
			],
		},
		url: `${api}/rma_numbers/88346234`,
		usecases: ['RMA'],
	},
];
