/**
 * Case interface.
 * Comments indicate field in API request, variable names indicate display name.
 */
export interface Case {
	/** Contract Id */
	contract: string;
	/** Description or first 10 words of summary */
	description: string;
	/** Host Name */
	hostName: string;
	/** All notes. First note is description. Latest update is last note */
	noteList: Note[];
	/** Id Number */
	number: string;
	/** Created date */
	opened: string;
	/** Owner name or email */
	owner: string;
	/** Related RMA Numbers. Sent as a comma-separated list */
	relatedRmas: string[];
	/** Product serial number */
	serialNumber: string;
	/**
	 * Priority
	 * 1 - Red - Network down
	 * 2 - Orange - Severely degraded
	 * 3 - Yellow - Network impaired
	 * 4 - Blue - Ask a question
	 */
	severity: string;
	/** Status */
	status: string;
	/** Summary */
	summary: string;
	/** Case Owner */
	tacEngineer: string;
	/** Tracking Number */
	trackingNumber: string;
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
