import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Main Search Component
 */
@Component({
	selector: 'app-search',
	styleUrls: ['./search.component.scss'],
	templateUrl: './search.component.html',
})
export class SearchComponent implements OnInit {

	public searchForm: FormGroup;
	public search: FormControl = new FormControl('');
	public hidden = true;

	@ViewChild('searchInput')
	public searchInput: ElementRef;

	constructor (
		private logger: LogService,
	) {
		this.logger.debug('SearchComponent Created!');
	}

	/**
	 * Function which will instantiate the searchForm
	 */
	public ngOnInit () {
		this.searchForm = new FormGroup({
			search: this.search,
		});

		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(map((evt: any) => evt.target.value))
			.pipe(debounceTime(1000))
			.pipe(distinctUntilChanged())
			.subscribe((search: string) => {
				this.logger.debug(`Search String :: ${search}`);
				this.hidden = false;
			});
	}
}
