import {
	Component,
	Input,
} from '@angular/core';
import { CriticalBug } from '@sdp-api';

/**
 * Bug Details Header
 */
@Component({
	selector: 'bug-details-header',
	templateUrl: './bug-details-header.component.html',
})
export class BugDetailsHeaderComponent {

	@Input('details') public details: CriticalBug;
}
