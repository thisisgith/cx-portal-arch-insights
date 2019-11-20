import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RolesService } from './roles.service';
import { ControlPointUserManagementAPIService } from '@sdp-api';
import { RouterTestingModule } from '@angular/router/testing';
import { inject, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { of, asyncScheduler } from 'rxjs';

describe('RolesService', () => {
	let api: ControlPointUserManagementAPIService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				ControlPointUserManagementAPIService,
				RolesService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});

		api = TestBed.get(ControlPointUserManagementAPIService);
		spyOn(api, 'getListRolesForGivenUserUsingGET')
			.and
			.returnValue(of({
				saRoles: [],
				vaRoles: [],
			}, asyncScheduler));
	});

	it('should be created', inject([RolesService], (service: RolesService) => {
		expect(service)
			.toBeTruthy();
	}));
});
