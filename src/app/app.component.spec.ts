import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { throwError, Observable } from 'rxjs';
import { EntitlementWrapperService, OrgUserService } from '@sdp-api';
import { mappedUser } from '@mock';
import { UserRoles } from '@constants';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;
	let router: Router;
	let de: DebugElement;
	let service: AppService;

	describe('Spinner', () => {
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [AppTestModule],
			})
				.compileComponents();

			service = TestBed.get(AppService);
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
		let entitlementWrapperService: EntitlementWrapperService;
		let orgUserService: OrgUserService;

		beforeEach(() => {
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
			fixture = TestBed.createComponent(AppComponent);
			component = fixture.componentInstance;
			router = fixture.debugElement.injector.get(Router);
			userResolve = TestBed.get(UserResolve);
			entitlementWrapperService = TestBed.get(EntitlementWrapperService);
			orgUserService = TestBed.get(OrgUserService);
			fixture.detectChanges();
			window.localStorage.removeItem('activeSmartAccount');
		});

		it('should resolve to a user', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getUser()
				.subscribe((u: User) => {
					expect(u)
						.toEqual(mappedUser);

					done();
				});
			});
		});

		it('should resolve to a cached user', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.getUser()
				.subscribe((u: User) => {
					expect(u)
						.toEqual(mappedUser);
				});

				userResolve.resolve()
				.subscribe(() => {
					userResolve.resolve()
					.subscribe((u: User) => {
						expect(u)
							.toEqual(mappedUser);

						done();
					});
				});
			});
		});

		it('should fail gracefully when resolving userAccounts', done => {
			const error = {
				status: 404,
				statusText: 'Resource not found',
			};
			spyOn(entitlementWrapperService, 'userAccounts')
				.and
				.returnValue(throwError(error));

			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe((u: User) => {
					expect(u)
						.toBeNull();

					done();
				});
			});
		});

		it('should fail gracefully when resolving getUserV2', done => {
			const error = {
				status: 404,
				statusText: 'Resource not found',
			};
			spyOn(orgUserService, 'getUserV2')
				.and
				.returnValue(throwError(error));

			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe((u: User) => {
					expect(u)
						.toBeNull();

					done();
				});
			});
		});

		it('should resolve a customerId', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getCustomerId()
					.subscribe((id: string) => {
						expect(id)
							.toEqual(mappedUser.info.customerId);

						done();
					});
				});
			});
		});

		it('should resolve a cxLevel', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getCXLevel()
					.subscribe((n: number) => {
						expect(n)
							.toEqual(Number(mappedUser.service.cxLevel));

						done();
					});
				});
			});
		});

		it('should resolve a role', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getRole()
					.subscribe((s: string) => {
						expect(s)
							.toEqual(mappedUser.info.individualAccount.role);

						done();
					});
				});
			});
		});

		it('should resolve an sa id', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getSaId()
					.subscribe((n: number) => {
						expect(n)
							.toEqual(mappedUser.info.companyList[0].companyId);

						done();
					});
				});
			});
		});

		it('should resolve a data center', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getDataCenter()
					.subscribe((s: string) => {
						expect(s)
							.toEqual(mappedUser.info.dataCenter.dataCenter);

						done();
					});
				});
			});
		});

		it('should set the sa id', done => {
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.setSaId(mappedUser.info.companyList[0].companyId);
					userResolve.getSaId()
					.subscribe((n: number) => {
						expect(n)
							.toEqual(mappedUser.info.companyList[0].companyId);

						done();
					});
				});
			});
		});

		it('should resolve a valid sa id from local storage', done => {
			window.localStorage.setItem('activeSmartAccount', `${mappedUser.info.companyList[1].companyId}`);
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getSaId()
					.subscribe((n: number) => {
						expect(n)
							.toEqual(mappedUser.info.companyList[1].companyId);
						done();
					});
				});
			});
		});

		it('should prioritize `admin` over `user` and resolve the role', done => {
			window.localStorage.setItem('activeSmartAccount', `${mappedUser.info.companyList[1].companyId}`);
			fixture.whenStable()
			.then(() => {
				userResolve.resolve()
				.subscribe(() => {
					userResolve.getRole()
					.subscribe((s: string) => {
						expect(s)
							.toEqual(UserRoles.ADMIN);

						done();
					});
				});
			});
		});
	});

	describe('General', () => {
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
							resolve: () => new Observable<{ }>(observer => {
								observer.next(mappedUser);
							}),
						},
					},
				],
			});
			service = TestBed.get(AppService);
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

		it('should attempt to load foreign language i18n if requested', () => {
			service.loadI18n(true, 'es');
		});

		it('should append path to routeStack', () => {
			service.addRouteToList('test/route/1');
		});

		it('should get last item from routeStack', () => {
			service.addRouteToList('test/route/2');

			expect(service.getLastRoute())
				.toBe('test/route/2');
		});

		it('should pop items from route stack', () => {
			service.addRouteToList('test/route/3');

			expect(service.popRoute())
				.toBe('test/route/3');
		});
	});
});
