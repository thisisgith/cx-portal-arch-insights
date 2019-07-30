/**
 * Case interface.
 * Comments indicate field in API request, variable names indicate display name.
 */
export interface Case {
	/** Contract Id */
	contract?: string;
	/** Description or first 10 words of summary */
	description?: string;
	/** Host Name */
	hostName?: string;
	/** All notes. First note is description. Latest update is last note */
	noteList?: Note[];
	/** Id Number */
	number?: string;
	/** case Number */
	caseNumber: string;
	/** Created date */
	opened?: string;
	/** Owner name or email */
	owner?: string;
	/** Related RMA Numbers. Sent as a comma-separated list */
	relatedRmas?: string[];
	/** Product serial number */
	serialNumber?: string;
	/**
	 * Priority
	 * 1 - Red - Network down
	 * 2 - Orange - Severely degraded
	 * 3 - Yellow - Network impaired
	 * 4 - Blue - Ask a question
	 */
	severity?: string;
	/** Status */
	status?: string;
	/** Summary */
	summary?: string;
	/** Case Owner */
	tacEngineer?: string;
	/** Tracking Number */
	trackingNumber?: string;
}

/**
 * Note interface for note objects in the noteList array of Cases.
 */
export interface Note {
	/** Creation date */
	createdDate?: string;
	/** Note body */
	noteDetail: string;
	/** Note Title */
	note: string;
	/** Note Status Internal/External */
	noteStatus: string;
	/** From where this note is getting added  */
	noteType: string;
	/** Note Creater */
	createdBy: string;
	/** Id of note creater */
	createdByID: string;
}

/**
 * File interface for files related to cases.
 */
export interface File {
	/** File Size */
	fileSize: number;
	/** ID of File */
	fileId: number;
	/** Visibility */
	visibilityFlag: string;
	/** File Extension */
	fileContentType: string;
	/** File Status */
	fileStatus: string;
	/** File Name */
	fileName: string;
	/** File Category */
	fileCategory: string;
	/** Uploaded date */
	fileUploadDate: string;
	/** Download URL */
	downloadURL: string;
}

/**
 * Subtech interface for valid CSOne case subtechs
 */
export interface Subtech {
	_id: string;
	techId: string;
	subTechName: string;
	problemCodes: string[];
}

/**
 * Tech interface for valid CSOne case technologies
 */
export interface Tech {
	_id: string;
	techName: string;
}

/**
 * Tech interface for valid CSOne case problem areas
 */
export interface ProblemArea {
	customerActivity: string;
	problemCode: string;
	problemCodeName: string;
}

/**
 * Interface for "Open Case" CSOne API request
 */
export interface CaseOpenRequest {
	contactId: string;
	priority: number;
	serialNumber: string;
	subTechId?: string;
	techId?: string;
	problemCode?: string;
	customerActivity?: string;
	contractNumber?: string;
	productName?: string;
	requestType: string;
	siteId?: string;
	summary?: string;
	description?: string;
}
