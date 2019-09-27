import {
	Component,
	Input,
} from '@angular/core';

/**
 * Component representing the visual filter collapse toggle
 */
@Component({
	selector: 'visual-filter-toggle',
	template: `
	<div class="flex-center-vertical half-margin-right">
		<div inlineSVG="assets/icons/icon-filter.svg"
			class="vf-icon flex-center-vertical qtr-margin-right"></div>
		<span class="text-muted toggle" [innerText]="'_VisualFilters_' | i18n"></span>
		<span class="qtr-margin-left icon-tiny icon-dropdown toggle flex-center"
			[ngClass]="{
				'rotate-180': filterCollapse
			}">
		</span>
	</div>
	`,
	styleUrls: ['./visual-filter-toggle.component.scss'],
})
export class VisualFilterToggleComponent {
	@Input() public filterCollapse = false;
}
