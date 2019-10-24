import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RolesService } from './roles.service';
import { ControlPointUserManagementAPIService } from '@sdp-api';
import { inject, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('RolesService', () => {
	let api: ControlPointUserManagementAPIService;
	let getRolesSpy: jasmine.Spy;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
			],
			providers: [
				ControlPointUserManagementAPIService,
				RolesService,
			],
		});

		api = TestBed.get(ControlPointUserManagementAPIService);
		getRolesSpy = spyOn(api, 'getListRolesForGivenUserUsingGET')
			.and
			.returnValue(of({
				saRoles: [],
				vaRoles: [],
			}));
	});

	it('should be created', inject([RolesService], (service: RolesService) => {
		expect(service)
			.toBeTruthy();
	}));

	it('should share request', done => {
		inject([RolesService], (service: RolesService) => {
			service.roles
				.toPromise()
				.then(() => {
					const roles = service.roles;
					expect(roles)
						.toBeDefined();
					expect(getRolesSpy)
						.toHaveBeenCalledTimes(1);
					done();
				});
		})();
	});
});
