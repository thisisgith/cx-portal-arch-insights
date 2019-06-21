/**
 * RMA Alert Interface
 */
export interface RMAAlert {
	affected: number;
	affectedAssets: string[];
	id: string;
	status: string;
	submitted: string;
	summary: string;
	timeline: {
		date: string;
		past?: boolean;
		title: string;
	}[];
}

/**
 * A single parts line detail
 */
export interface PartsLineDetail {
	partsLineRef: string;
	partsLineStatus: string;
	partsTransactionType: string;
	shippedPartNo: string;
	partsDescription: string;
	partsQtyAuth: string;
	partsScheduledShipTime: string;
	partsqtyShipped: string;
	partsShipDate: string;
	partsShipmentWarehouse: string;
	partsDispatchStatus: string;
	shippedSerialID: string;
}

/**
 * A single return part
 */
export interface ReturnPart {
	returnLineRef: string;
	returnLineStatus: string;
	returnTransactionType: string;
	receivedPartNo: string;
	returnDescription: string;
	returnQtyAuth: string;
	returnToCiscoBy: string;
	reqturnQtyReceived: string;
	returnDateReceived: string;
	returnWarehouse: string;
	receivedSerialNumber: string;
}

/**
 * A single Labor Line
 */
export interface LaborLine {
	laborTaskNumber: string;
	laborStatus: string;
	primaryProductFamily: string;
	laborScheduledTime: string;
	laborDispatch: string;
	laborDispatchOrCancellationNotes: string;
}

/**
 * A single RMA
 */
export interface RMARecord {
	rmaNo: number;
	status: string;
	orderDate: string;
	caseId: string;
	requestedShipDate: string;
	originator: string;
	allowPartialShipment: string;
	failureClass: string;
	failureCode: string;
	contractId: string;
	serviceLevel: string;
	customerRefInfo: {
		customerPONumber: string,
		origSalesOrderNumb: string,
		customerRefNumber: string,
		customerProvidedSN: string,
	};
	shipToInfo: {
		customerName: string,
		address1: string,
		address2: string,
		address3: string,
		address4: string,
		city: string,
		state: string,
		country: string,
		postalCode: string,
		stateProv: string,
		siteUseId: string,
		ackUserId: string,
		ackPhone: string,
		ackEmail: string,
		ackName: string,
		shipToContactName: string,
		shipToContactPhone: string,
		shipToContactEmail: string,
	};
	billToInfo: {
		customerName: string,
		address1: string,
		address2: string,
		address3: string,
		address4: string,
		city: string,
		state: string,
		country: string,
		postalCode: string,
		stateProv: string,
		siteUseId: string,
	};
	replacementParts: {
		trackingInfo: {
			trackingNumber: string,
			courierList: string,
			shipDate: string,
		},
		partsLineDetails: PartsLineDetail[],
	};
	returnLines: {
		returnParts: ReturnPart[],
	};
	laborDetails: {
		fieldEngineerName: string,
		fieldEngineerPhone: string,
		fieldEngineerOnRouteTime: string,
		fieldEngineerArrivedTime: string,
		fieldEngineerReleasedTime: string,
		laborLines: LaborLine[],
	};
	notes: {
		addlComments: string,
		failureDescription: string,
		fieldEngineerInstructions: string,
		partDeliveryInstructions: string,
		partialShipmentNote: string,
		specialInstructions: string,
	};
}

/**
 * RMA success response type
 */
export interface RMASuccess {
	APIPagination: {
		pageIndex: string,
		lastIndex: string,
		totalRecords: string,
		pageRecords: string,
		title: string,
		selfLint: string,
	};
	returns: {
		RmaRecord: RMARecord[],
	};
}

/**
 * RMA error response type
 */
export interface RMAError {
	APIError: {
		Error: [{
			errorCode: string;
			errorDescription: string;
			suggestedAction: string;
		}],
	};
}

/**
 * Response from get RMA by number
 */
export type RMAResponse = RMASuccess | RMAError;
