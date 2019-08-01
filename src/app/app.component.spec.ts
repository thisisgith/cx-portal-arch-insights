import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { UserResolve } from '@utilities';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { I18n } from '@cisco-ngx/cui-utils';
import {
	CuiToasterComponent,
	CuiModalComponent,
} from '@cisco-ngx/cui-components';
import { HeaderComponent } from './components/header/header.component';
import { AppService } from './app.service';
import { AppTestModule } from './app-test.module.spec';
import { User } from '@interfaces';
import { user } from '@mock';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let router: Router;
	let de: DebugElement;
	let service: AppService;

	describe('Spinner', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [AppTestModule],
			})
				.compileComponents();

			service = TestBed.get(AppService);
		}));

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

		it('should hide the loading spinner on route end', () => {
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

	describe('UserResolve', () => {
		let userResolve: UserResolve;

		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule,
					AppModule,
				],
				providers: [
					UserResolve,
				],
			})
			.compileComponents();

			userResolve = TestBed.get(UserResolve);
		}));

		beforeEach(() => {
			fixture = TestBed.createComponent(AppComponent);
			component = fixture.componentInstance;
			router = fixture.debugElement.injector.get(Router);
			fixture.detectChanges();
		});

		it('should resolve to a user', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getUser()
				.subscribe((u: User) => {
					expect(u)
						.toEqual(user);

					done();
				});

				userResolve.resolve()
				.subscribe();
			});
		});

		it('should resolve a customerId', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getCustomerId()
				.subscribe((id: string) => {
					expect(id)
						.toEqual(user.info.customerId);

					done();
				});

				userResolve.resolve()
				.subscribe();
			});
		});

		it('should resolve a cxLevel', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getCXLevel()
				.subscribe((s: number) => {
					expect(s)
						.toEqual(user.service.cxLevel);

					done();
				});

				userResolve.resolve()
				.subscribe();
			});
		});

		it('should resolve a solution', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getSolution()
				.subscribe((s: string) => {
					expect(s)
						.toEqual(user.service.solution);

					done();
				});

				userResolve.resolve()
				.subscribe();
			});
		});

		it('should resolve a use case', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getUseCase()
				.subscribe((s: string) => {
					expect(s)
						.toEqual(user.service.useCase);

					done();
				});

				userResolve.resolve()
				.subscribe();
			});
		});
	});

	describe('General', () => {
		beforeEach(async(() => {
			TestBed.configureTestingModule({
				imports: [
					RouterTestingModule,
					AppModule,
				],
			})
				.compileComponents();

			service = TestBed.get(AppService);
		}));

		beforeEach(() => {
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

		it('should load the i18n files', () => {
			const title = 'CX Console';
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

		it('should not reload the i18n if already loaded', () => {
			expect(service.i18nLoaded)
				.toBeTruthy();

			service.loadI18n();
		});

		it('should attempt to load foreign language i18n if requested', () => {
			service.loadI18n(true, 'es');
		});
	});
});
