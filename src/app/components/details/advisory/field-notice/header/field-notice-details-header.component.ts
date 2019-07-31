import {
	Component,
	Input,
} from '@angular/core';
import { Data as FieldNoticeData } from '../field-notice-details.component';

/**
 * Field Notice Details Header
 */
@Component({
	selector: 'field-notice-details-header',
	templateUrl: './field-notice-details-header.component.html',
})
export class FieldNoticeDetailsHeaderComponent {

	@Input('details') public details: FieldNoticeData;
}
