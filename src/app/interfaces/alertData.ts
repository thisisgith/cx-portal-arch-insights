import {
	Advisory,
	Announcement,
	Case,
	Contract,
	Bug,
	FieldNotice,
	License,
	RMAAlert,
} from './index';

/**
 * Type which contains an OR'ed interface for Alerts
 */
export type AlertData = Advisory | Bug | Case | Contract |
Announcement | FieldNotice | License | RMAAlert;
