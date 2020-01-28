import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, Event as RouterEvent, ActivationEnd } from '@angular/router';
import { I18n } from '@cisco-ngx/cui-utils';
import { Subscription } from 'rxjs';

@Component({
	selector: 'a11y-title',
	templateUrl: './a11y-title.component.html',
})
export class A11yTitleComponent implements OnInit {

	public screenReaderPageTitle = '';
	private routerSubscription: Subscription;
	private parent: HTMLElement;
	private currentPage = '';

	constructor (
		private router: Router,
		private el: ElementRef,
	) { }

	private setUpParentComponentAttributes (): void {
		const { nativeElement: { parentElement } } = this.el;
		this.parent = parentElement;
		this.parent.setAttribute('tabindex', '-1');
		this.parent.setAttribute('aria-live', 'polite');
	}

	private subscribeToRouterEvents = (event: RouterEvent): void => {
		if (!(event instanceof ActivationEnd)) {
			return;
		}

		const { data: { title = '' } = { } } = event.snapshot.parent.firstChild;

		if (!this.currentPage && title || title && this.currentPage && title !== this.currentPage) {
			this.currentPage = title;
			const titleText = I18n.get(title);
			this.screenReaderPageTitle = I18n.get('_LandedOnPageText_', titleText);
			if (this.parent) {
				this.parent.focus();
			}
		}

	}

	public ngOnInit (): void {
		this.setUpParentComponentAttributes();
		this.routerSubscription = this.router.events
			.subscribe(this.subscribeToRouterEvents);
	}

	public ngOnDestroy (): void {
		if (this.routerSubscription) {
			this.routerSubscription.unsubscribe();
		}
	}
}
