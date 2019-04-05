import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	CuiToasterComponent,
	CuiModalComponent,
} from '@cisco-ngx/cui-components';
import { HeaderComponent } from './components/header/header.component';
import { Subject } from 'rxjs';

/**
 * MockRouter used to help show/hide the spinner
 */
class MockRouter {
	public subject = new Subject();
	public events = this.subject.asObservable();

	/**
	 * Mocking navigate from Router
	 * @param url The url to mock route to
	 */
	public navigate (url: string) {
		if (!url) {
			this.subject.next(new NavigationEnd(1, null, url));
		} else {
			this.subject.next(new NavigationStart(0, url));
		}
	}
}

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let router: Router;
	let de: DebugElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				AppModule,
			],
			providers: [
				{
					provide: Router,
					useClass: MockRouter,
				},
			],
		})
		.compileComponents();

		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should create the app', () => {
		const app = fixture.debugElement.componentInstance;
		expect(app)
			.toBeTruthy();
	});

	it('should load the i18n files', fakeAsync(() => {
		const title = 'Persona Based Console';
		tick(500);
		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(I18n.get('_ApplicationName_'))
					.toBe(title);
			});
	}));

	it('should show the header', () => {
		component.status.i18n = true;
		fixture.detectChanges();
		de = fixture.debugElement.query(By.directive(HeaderComponent));
		expect(de)
			.toBeTruthy();
	});

	it('should have the toaster', () => {
		de = fixture.debugElement.query(By.directive(CuiToasterComponent));
		expect(de)
			.toBeTruthy();
	});

	it('should have the modals', () => {
		de = fixture.debugElement.query(By.directive(CuiModalComponent));
		expect(de)
			.toBeTruthy();
	});

	it('should show the loading spinner by default', () => {
		expect(component.status.loading)
			.toBeTruthy();

		de = fixture.debugElement.query(By.css('cui-spinner'));
		expect(de)
			.toBeTruthy();
	});

	it('should show the loading spinner on route start', () => {
		expect(component.status.loading)
			.toBeTruthy();

		component.status.loading = false;

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('cui-spinner'));
		expect(de)
			.toBeNull();

		router.navigate(['']);

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('cui-spinner'));

		expect(component.status.loading)
			.toBeTruthy();

		expect(de)
			.toBeTruthy();
	});

	it('should hide the loading spinner on route end', () => {
		expect(component.status.loading)
			.toBeTruthy();

		component.status.loading = false;

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('cui-spinner'));
		expect(de)
			.toBeNull();

		router.navigate(['']);

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('cui-spinner'));

		expect(component.status.loading)
			.toBeTruthy();

		expect(de)
			.toBeTruthy();

		router.navigate(null);

		fixture.detectChanges();

		de = fixture.debugElement.query(By.css('cui-spinner'));

		expect(component.status.loading)
			.toBeFalsy();

		expect(de)
			.toBeNull();
	});
});
