import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { UserResolve } from '@utilities';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import {
	CuiToasterComponent,
	CuiModalComponent,
} from '@cisco-ngx/cui-components';
import { HeaderComponent } from './components/header/header.component';
import { AppService } from './app.service';
import { User } from '@interfaces';
import { Observable, of } from 'rxjs';
import { mappedUser } from '@mock';
import { I18n } from '@cisco-ngx/cui-utils';
const testCxLevel = mappedUser.info.subscribedSolutions.cxLevel;
const testRole = mappedUser.info.individual.role;

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let router: Router;
	let de: DebugElement;

	describe('Spinner', () => {
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [AppModule],
				providers: [
					{
						provide: AppService,
						useValue: {
							initializeRacetrack: () => of(null),
							initializeUser: () => of(mappedUser),
							addRouteToList: (_url: any) => [_url],
							loadI18n: () => of(null),
						},
					},
				],
			});
		});

		beforeEach(() => {
			fixture = TestBed.createComponent(AppComponent);
			component = fixture.componentInstance;
			router = fixture.debugElement.injector.get(Router);
			fixture.detectChanges();
		});

		it('should show the loading spinner by default', () => {
			expect(component.status.loading)
				.toBeTruthy();

			de = fixture.debugElement.query(By.css('#spinner-container'));
			expect(de)
				.toBeTruthy();
			expect(de.nativeElement.getAttribute('hidden'))
				.toBeNull();
		});

		it('should show the loading spinner on route start', () => {
			expect(component.status.loading)
				.toBeTruthy();

			component.status.loading = false;

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#spinner-container'));
			expect(de.nativeElement.getAttribute('hidden'))
				.toBe('');

			router.navigate(['']);

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#spinner-container'));

			expect(component.status.loading)
				.toBeTruthy();

			expect(de.nativeElement.getAttribute('hidden'))
				.toBeNull();
		});

		xit('should hide the loading spinner on route end', () => {
			expect(component.status.loading)
				.toBeTruthy();

			component.status.loading = false;

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#spinner-container'));
			expect(de.nativeElement.getAttribute('hidden'))
				.toBe('');

			router.navigate(['']);

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#spinner-container'));

			expect(component.status.loading)
				.toBeTruthy();

			expect(de.nativeElement.getAttribute('hidden'))
				.toBeNull();

			router.navigate(null);

			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#spinner-container'));

			expect(component.status.loading)
				.toBeFalsy();

			expect(de.nativeElement.getAttribute('hidden'))
				.toBe('');
		});

	});

	describe('General', () => {
		const user: User = { info: null, service: { serviceLineName: '', cxLevel: '' } };
		beforeEach(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule,
					AppModule,
				],
				providers: [
					{
						provide: UserResolve,
						useValue: {
							getUser: () => new Observable<{ }>(observer => {
								observer.next(mappedUser);
							}),
							getCXLevel: () => new Observable<{ }>(observer => {
								observer.next(testCxLevel);
							}),
							getRole: () => new Observable<{ }>(observer => {
								observer.next(testRole);
							}),
							resolve: () => new Observable<{ }>(observer => {
								observer.next(mappedUser);
							}),
						},
					},
					{
						provide: AppService,
						useValue: {
							initializeUser: () => of(user),
							addRouteToList: (_url: any) => [_url],
							loadI18n: () => of(null),
						},
					},
				],
			});
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

		xit('should load the i18n files', () => {
			const title = 'Customer Experience Portal';
			fixture.detectChanges();

			fixture.whenStable()
				.then(() => {
					expect(I18n.get('_ApplicationName_'))
						.toBe(title);
				});
		});

		it('should show the header', () => {
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

	});
});
