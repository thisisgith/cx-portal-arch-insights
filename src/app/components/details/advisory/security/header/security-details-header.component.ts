import {
	Component,
	Input,
} from '@angular/core';
import { Data as SecurityData } from '../security-details.component';

/**
 * Security Details Header
 */
@Component({
	selector: 'security-details-header',
	templateUrl: './security-details-header.component.html',
})
export class SecurityDetailsHeaderComponent {

	@Input('details') public details: SecurityData;
}
