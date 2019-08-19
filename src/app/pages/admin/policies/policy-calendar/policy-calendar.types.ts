import { PolicyResponseModel } from '@sdp-api';
/**
 * Represents a calendar cell
 */
export interface CalendarCell {
	date?: Date;
	dayOfMonth?: number;
	hasCollection?: boolean;
	hasIgnore?: boolean;
	hasScan?: boolean;
	isBlankCell: boolean;
	isToday?: boolean;
	policies?: PolicyResponseModel[];
}
