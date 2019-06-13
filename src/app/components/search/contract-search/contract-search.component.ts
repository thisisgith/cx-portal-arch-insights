import { Component, Input, TemplateRef, ViewChild, forwardRef } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';

import { SpecialSearchComponent } from '../special-search/special-search.component';

/**
 * Component to fetch/display contract search results
 */
@Component({
	providers: [{
		provide: SpecialSearchComponent,
		useExisting: forwardRef(() => ContractSearchComponent,
	)}],
	selector: 'app-contract-search',
	styleUrls: ['./contract-search.component.scss'],
	templateUrl: './contract-search.component.html',
})
export class ContractSearchComponent extends SpecialSearchComponent {
	@ViewChild('sidebar', { static: true, read: TemplateRef })
		public sidebarContent: TemplateRef<any>;
	@Input('contractNumber') public contractNumber: string;

	constructor (
		private logger: LogService,
	) {
		super();
		this.logger.debug('ContractSearchComponent Created!');
	}
}
