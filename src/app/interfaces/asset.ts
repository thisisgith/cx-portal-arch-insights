import {
	HardwareAsset,
	AssetSummary,
	SystemAsset,
	AssetSystemSummary,
	HardwareEOL,
	HardwareEOLBulletin,
	FieldNotice,
	FieldNoticeBulletin,
} from '@sdp-api';

import { TimelineDatapoint } from './timelineDatapoint';

/**
 * A SystemAsset that has an AssetSystemSummary attached
 */
export interface ModSystemAsset extends SystemAsset {
	summary?: AssetSystemSummary;
}

/**
 * A HardwareAsset that has AssetSummary attached
 */
export interface ModHardwareAsset extends HardwareAsset {
	summary?: AssetSummary;
	eol?: ModHardwareEOL;
	fieldNotices?: ModFieldNotice[];
}

/**
 * A HardwareEOL that has HardwareEOLBulletin and TimelineDatapoints attached
 */
export interface ModHardwareEOL extends HardwareEOL {
	timelineData: TimelineDatapoint[];
	bulletin?: HardwareEOLBulletin;
}

/**
 * A FieldNotice that has FieldNoticeBulletin attached
 */
export interface ModFieldNotice extends FieldNotice {
	bulletin?: FieldNoticeBulletin;
}
