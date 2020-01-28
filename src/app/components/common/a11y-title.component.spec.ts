import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { A11yTitleComponent } from './a11y-title.component';
import { Component, ViewChild, ElementRef, DebugElement } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { By } from '@angular/platform-browser';
import { I18n } from '@cisco-ngx/cui-utils';
import * as enUSJson from 'src/assets/i18n/en-US.json';

class ActivatedRouteSnapshotTest {
	public parent = {
		firstChild: {
			data: {
				title: '_Lifecycle_',
			},
		},
	};
}

@Component({
	template: `
		<div #parentEl>
			<a11y-title #title></a11y-title>
		</div>
	`,
})
class TestComponent {
	@ViewChild('parentEl', { static: true }) public parentEl: ElementRef;
	@ViewChild('title', { static: true }) public title: A11yTitleComponent;
}

class MockRouter {
	public events = new Observable(observer => {
		const snapShot = new ActivatedRouteSnapshotTest();
		const event = new (<any> ActivationEnd)(snapShot);
		observer.next(event);
		observer.complete();
	});
}

describe('A11yTitleComponent', () => {
	let component: TestComponent;
	let fixture: ComponentFixture<TestComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				A11yTitleComponent,
				TestComponent,
			],
			providers: [
				{ provide: Router, useClass: MockRouter },
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should create tabindex on parent', () => {
		const parent = fixture.componentInstance.parentEl.nativeElement;
		const tabindex = parent.getAttribute('tabindex');
		expect(tabindex)
			.toBe('-1');
	});

	it('should create aria-live on parent', () => {
		const parent = fixture.componentInstance.parentEl.nativeElement;
		const tabindex = parent.getAttribute('aria-live');
		expect(tabindex)
			.toBe('polite');
	});

	it('should create page title', () => {
		const a11yTitle: DebugElement = fixture.debugElement.query(By.css('.sr-only'));
		const title  = a11yTitle.nativeElement.innerHTML;
		expect(title)
			.toBe(' You have navigated to the Lifecycle page\n');
	});
});
