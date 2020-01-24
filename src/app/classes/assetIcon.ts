import { Asset, NetworkElement } from '@sdp-api';
import * as _ from 'lodash-es';

/**
 * Returns the image
 * @param asset the asset to look up the image for
 * @returns the image string
 */
export function getProductTypeImage (asset: (Asset | NetworkElement)) {
	const type = _.toLower(_.get(asset, 'productType', ''));
	const family = _.toLower(_.get(asset, 'productFamily', ''));

	if (type) {
		if (type.includes('router')) {
			return 'router-outline';
		}
		if (type.includes('switch')) {
			return 'switch-outline';
		}
		if (type.includes('module')) {
			return 'module';
		}
		if (type.includes('wireless') && family) {
			if (family.includes('wireless controller')) {
				return 'wlc-outline';
			}

			return 'accesspoint-outline';
		}
	}
}

/**
 * Returns a title for an asset for use in the product images
 * @param asset the asset to look up the type/family for
 * @returns the title string
 */
export function getProductTypeTitle (asset: (Asset | NetworkElement)) {
	const type = _.get(asset, 'productType');
	const family = _.get(asset, 'productFamily');

	const typeStr = type ? `${type} ` : '';
	const familyStr = family ? `(${family})` : '';

	return `${typeStr}${familyStr}`;
}
