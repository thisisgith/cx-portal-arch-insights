import {
	Component,
} from '@angular/core';
import { CuiModalService, CuiModalContent } from '@cisco-ngx/cui-components';
import { SetupIEStateService } from '../setup-ie-state.service';

/**
 * ResetCacheModal
 */
@Component({
	selector: 'reset-cache-modal',
	templateUrl: './reset-cache-modal.component.html',
})
export class ResetCacheModal
implements CuiModalContent {
	public data;

	constructor (
		public cuiModalService: CuiModalService,
		private state: SetupIEStateService,
	) {
	}

	/**
	 * Continue on the cached step
	 */
	public continue ()  {
		this.cuiModalService.onSuccess.next(true);
		this.cuiModalService.hide();
	}

	/**
	 * Remove the cache and return user to the first step
	 */
	public startOver () {
		this.state.clearState();

		this.cuiModalService.onSuccess.next(false);
		this.cuiModalService.hide();
	}
}
