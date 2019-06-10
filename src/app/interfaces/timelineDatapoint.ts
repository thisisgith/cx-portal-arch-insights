/**
 * TimelineDatapoint for use with the TimelineComponent
 */
export interface TimelineDatapoint {
	title: string;
	subTitle: string;
	date: Date;
	muted?: boolean;
}

/**
 * Describes a TimelineDatapoint's relationt to Today
 */
export interface TodayRelation {
	isFuture?: boolean;
	isPast?: boolean;
	isToday?: boolean;
}

/**
 * A union of TimelineDatapoint and TodayRelation (used internally by the TimelineComponent)
 */
export type TimelineInternalDatapoint = TimelineDatapoint & TodayRelation;
