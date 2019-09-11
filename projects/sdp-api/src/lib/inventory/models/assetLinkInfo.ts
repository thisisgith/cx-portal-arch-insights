import { Asset } from './asset';
import { NetworkElement } from './network-element';

/**
 * Asset link Information
 */
export interface AssetLinkInfo {
	asset: Asset;
	element: NetworkElement;
}
