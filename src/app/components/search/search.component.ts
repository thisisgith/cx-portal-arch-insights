import {
	Component,
	ElementRef,
	HostListener,
	OnInit,
	Pipe,
	PipeTransform,
	ViewChild,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { FormGroup, FormControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchService, SearchResults } from './search.service';

import * as _ from 'lodash';

/**
 * Pipe used to highlight given key words in a text string by returning parseable HTML
 */
@Pipe({
	name: 'highlight',
})
export class HighlightPipe implements PipeTransform {
	/**
	 * Performs the string parsing and hightlighting
	 *
	 * @param input the string input
	 * @param terms the string to parse for highlighting
	 * @returns the highlighted string
	 */
	public transform (input: string, terms: string[]): string {
		return _.reduce(terms, (current: string, term: string) => {
			const start = current.toLowerCase()
				.indexOf(term.toLowerCase());

			if (start !== -1) {
				const initial = current.substring(start, start + term.length);

				return _.replace(current, initial, `<span class="text-bold">${initial}</span>`);
			}

			return current;
		}, input);
	}
}

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
	public searchResults: SearchResults;
	public status = {
		hidden: true,
		searching: false,
	};
	public options = {
		debounce: 1500,
		max: 100,
		min: 3,
		pattern: /^[a-zA-Z ]*$/,
	};

	@ViewChild('searchInput')
	public searchInput: ElementRef;

	/**
	 * Listener to detect the escape key and hide the modal if pressed
	 */
	@HostListener('document:keydown.escape', ['$event'])
	private escapeHandler () {
		this.status.hidden = true;
	}

	constructor (
		private logger: LogService,
		private service: SearchService,
	) {
		this.logger.debug('SearchComponent Created!');
	}

	/**
	 * Performs the search query against the search service and handles showing/hiding the modal
	 * @param query the query to search for
	 */
	public doSearch (query: string) {
		this.status.hidden = true;
		if (query.trim() !== '') {
			this.searchResults = null;
			this.status.hidden = false;
			this.status.searching = true;
			this.service.search(query)
			.subscribe((results: SearchResults) => {
				this.searchResults = results;
			},
			err => {
				this.logger.error(`Search Query :: ${query} :: Error ${err}`);
			},
			() => {
				this.status.searching = false;
			});
		}
	}

	/**
	 * Function which will instantiate the searchForm
	 */
	public ngOnInit () {
		this.searchForm = new FormGroup({
			search: this.search,
		});

		fromEvent(this.searchInput.nativeElement, 'keyup')
			.pipe(map((evt: KeyboardEvent) => (<HTMLInputElement> evt.target).value))
			.pipe(debounceTime(this.options.debounce))
			.pipe(distinctUntilChanged())
			.subscribe((query: string) => {
				if (this.search.valid) {
					this.doSearch(query);
				}
			});
	}
}
