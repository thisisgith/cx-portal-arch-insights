import {
	Component,
	NgZone,
	Renderer,
	ElementRef,
	ViewChild,
	OnInit,
} from '@angular/core';

import {
	Router,
	Event as RouterEvent,
	NavigationStart,
	NavigationEnd,
	NavigationError,
	NavigationCancel,
} from '@angular/router';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { I18n, Language } from '@cisco-ngx/cui-utils';
import { LogService } from '@cisco-ngx/cui-services';

@Component({
	selector: 'app-root',
	styleUrls: ['./app.component.scss'],
	templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

	@ViewChild('spinnerElement')
	private spinnerElement: ElementRef;

	@ViewChild('routerElement')
	private routerElement: ElementRef;

	public headerOptions = {
		breadcrumbs: [
			{
				label: 'Home',
				url: '/',
			},
		],
		menuToggleButton: true,
		title: '',
	};

	constructor (
		private http: HttpClient,
		private router: Router,
		private ngZone: NgZone,
		private renderer: Renderer,
		private logger: LogService,
	) {
		this.router.events.subscribe(
			(event: RouterEvent): void => {
				this.navigationInterceptor(event);
			},
		);
	}

	public ngOnInit () {
		this.loadI18n();
	}

	private loadI18n () {
		forkJoin(
			this.getI18n(`assets/i18n/${Language.getPreferred()}.json`),
			this.getI18n('assets/i18n/en-US.json'),
		)
		.subscribe(
			([preferred, enUS]) => {
				if (preferred) {
					I18n.injectDictionary(preferred);
				}
				if (enUS) {
					I18n.injectDictionary(preferred, false);
				}

				this.headerOptions.title = I18n.get('_ApplicationName_');
			},
			() => {
				this.logger.error('loadI18n() :: Failed to instantiate i18n files');
			},
		);
	}

	private getI18n (path: string): Observable<object | { }> {
		return this.http.get(path)
		.pipe(
			catchError((error: HttpErrorResponse) => {
				this.logger.error(
					`getI18n() :: Error fetching json file at ${path} (${error.statusText})`);

				return of({ });
			}),
		);
	}

	// Shows and hides the loading spinner during RouterEvent changes
	private navigationInterceptor (event: RouterEvent): void {
		if (event instanceof NavigationStart) {
			this.showSpinner();
		}
		if (event instanceof NavigationEnd
				|| event instanceof NavigationCancel
				|| event instanceof NavigationError) {
			this.hideSpinner();
		}
	}

	private hideSpinner (): void {
		// we wanna run this function outside of Angular's zone to
		// bypass change detection
		this.ngZone.runOutsideAngular(() => {
			this.renderer.setElementStyle(
				this.spinnerElement.nativeElement,
				'display',
				'none',
			);
			this.renderer.setElementStyle(
				this.routerElement.nativeElement,
				'display',
				'block',
			);
		});
	}

	private showSpinner (): void {
		// We wanna run this function outside of Angular's zone to
		// bypass change detection
		this.ngZone.runOutsideAngular(() => {
			// for simplicity we are going to turn opacity on/off
			// you could add.remove a slcass for more advanced styling
			// and enter/leave animation for spinner
			this.renderer.setElementStyle(
				this.spinnerElement.nativeElement,
				'display',
				'block',
			);
			this.renderer.setElementStyle(
				this.routerElement.nativeElement,
				'display',
				'none',
			);
		});
	}
}
