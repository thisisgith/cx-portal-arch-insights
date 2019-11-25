import { async, TestBed } from '@angular/core/testing';
import { RouteGuard } from './route-guard';
import { UserResolve } from '@utilities';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('RouteGuardGuard', () => {
	let userResolve: UserResolve;
	let guard: RouteGuard;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				UserResolve,
				RouteGuard,
			],
		})
 		 .compileComponents();
	}));
	beforeEach(() => {
		userResolve = TestBed.get(UserResolve);
		guard = TestBed.get(RouteGuard);
	});
	it('should be true for cxlevel 2 and role admin..', () => {
		const reponse = {
			info: {
				individual : {
					role : 'AccountAdmin',
				},
			},
			service: {
				cxLevel: 2,
			},
		};
		spyOn(userResolve, 'getUser').and
			.returnValue(of<any>(reponse));
		guard.canActivate()
			.subscribe(res => {
				expect(res)
			.toBeTruthy();
			});
	});

	it('should be falsy for cxlevel 1 and role admin..', () => {
		const reponse = {
			info: {
				individual : {
					role : 'admin',
				},
			},
			service: {
				cxLevel: 1,
			},
		};
		spyOn(userResolve, 'getUser').and
			.returnValue(of<any>(reponse));
		guard.canActivate()
			.subscribe(res => {
				expect(res)
			.toBeFalsy();
			});
	});

});
