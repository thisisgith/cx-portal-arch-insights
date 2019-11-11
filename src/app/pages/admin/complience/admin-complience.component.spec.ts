import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AdminComplienceComponent } from './admin-complience.component';
import { AdminComplienceModule } from './admin-complience.module';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { AssetTaggingService, ControlPointAdminComplienceService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { RouteAuthService } from '@services';
import { HttpErrorResponse } from '@angular/common/http';
import { LogService } from '@cisco-ngx/cui-services';

fdescribe('AdminComplienceComponent', () => {
	let component: AdminComplienceComponent;
	let fixture: ComponentFixture<AdminComplienceComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				RouterTestingModule,
				AdminComplienceModule,
				RouterTestingModule,
			],
			providers: [
				CuiModalService,
				AssetTaggingService,
				ControlPointAdminComplienceService,
				RouteAuthService,
				LogService,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AdminComplienceComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('test toggleOptlnStatus', () => {
		it('should display a modal if there is right side tags', () => {
			component.leftSideTags = null;
			component.rightSideTags = [{
				deviceCount: 1,
				devices: [],
				tagName: 'Tag Name',
				tagValue: '1',
			}];
			component.toggleOptlnStatus();
			expect(component.optlnStatus)
				.toBeTruthy();
		});
		it('should display a modal if there is left side tags', () => {
			component.rightSideTags = null;
			component.leftSideTags = [{
				deviceCount: 1,
				devices: [],
				tagName: 'Tag Name',
				tagValue: '1',
			}];
			component.toggleOptlnStatus();
			expect(component.optlnStatus)
			.toBeTruthy();
		});

		it('should not display modal if there is no tags', () => {
			component.rightSideTags = null;
			component.leftSideTags = null;
			component.toggleOptlnStatus();
			expect(component.optlnStatus)
			.toBe(component.optlnStatus);
		});
	});

	describe('filter duplicates', () => {
		it('should have left side tag response', () => {
			component.selectedPolicy = 'HIPPA';
			component.rightSideTags = [{
				deviceCount: 5,
				devices: 1,
			}];
			component.leftSideTagsResponse = {
				tags: [{
					deviceCount: 1,
					devices: [],
					tagName: 'Tag Name',
					tagValue: '1',
				}],
			};
			component.rightSideTagsResponse = {
				policyGroups: [
					{
						devices: [],
						policyName: 'HIPPA',
						tags: [{
							deviceCount: 1,
							devices: [],
							tagName: 'Tag Name',
							tagValue: '2',
						}],
						toBeScanned: true,
					},
				],
			};
			component.filterDuplicates();
			expect(component.leftSideTags)
			.toBeDefined();
		});

		it('should have rigth side tag response', () => {
			component.selectedPolicy = 'HIPPA';
			component.rightSideTags = [{
				deviceCount: 5,
				devices: 1,
			}];
			component.leftSideTagsResponse = {
				tags: [{
					deviceCount: 1,
					devices: [],
					tagName: 'ABC',
					tagValue: '111',
				}],
			};
			component.rightSideTagsResponse = {
				policyGroups: [
					{
						devices: [],
						policyName: 'HIPPA',
						tags: [{
							deviceCount: 1,
							devices: [],
							tagName: 'ABC',
							tagValue: '111',
						}],
						toBeScanned: true,

					},
				],
			};
			component.filterDuplicates();
			expect(component.rightSideTags)
			.toBeDefined();
		});
	});

	describe('update permissions', () => {
		it('should update permissions with response', () => {
			let routeAuthService: RouteAuthService;
			routeAuthService = TestBed.get(RouteAuthService);
			spyOn(routeAuthService, 'updatePermissions').and
			.callThrough();
			component.updatePermissions();
			expect(routeAuthService.updatePermissions)
			.toHaveBeenCalled();
		});

		it('should handle failing api calls', fakeAsync(() => {
			const error = {
				status: 404,
				statusText: 'Resource not found',
			};
			let routeAuthService: RouteAuthService;
			let logService: LogService;
			routeAuthService = TestBed.get(RouteAuthService);
			logService = TestBed.get(LogService);

			spyOn(logService, 'error').and
			.callFake(() =>
				null);
			spyOn(routeAuthService, 'updatePermissions')
				.and
				.returnValue(throwError(new HttpErrorResponse(error)));
			component.updatePermissions()
			.subscribe(null,
				err => {
					expect(err.status)
					.toEqual(404);
				});
		}));
	});

	describe('should get tags', () => {
		it('should handle api failure of to get left side tags', fakeAsync(() => {
			let controlPointAdminComplienceService: ControlPointAdminComplienceService;
			controlPointAdminComplienceService = TestBed.get(ControlPointAdminComplienceService);
			spyOn(controlPointAdminComplienceService, 'getLeftSideTags').and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));
			component.getLeftSideTags()
			.subscribe(null,
				err => {
					expect(err.statusText)
					.toEqual('Resource not found');
				});
		}));

		it('should handle api failure of to get right side tags', fakeAsync(() => {
			let controlPointAdminComplienceService: ControlPointAdminComplienceService;
			controlPointAdminComplienceService = TestBed.get(ControlPointAdminComplienceService);
			spyOn(controlPointAdminComplienceService, 'getRightSideTags').and
				.returnValue(throwError(new HttpErrorResponse({
					status: 404,
					statusText: 'Resource not found',
				})));
			component.getRightSideTags()
			.subscribe(null,
				err => {
					expect(err.statusText)
					.toEqual('Resource not found');
				});
		}));
	});

	it('should discard changes', () => {
		spyOn(component, 'updateOptInOutStatus');
		component.discardChanges();
		expect(component.optlnStatus)
		.toBeFalsy();
		expect(component.updateOptInOutStatus)
		.toHaveBeenCalled();
	});

	it('should save changes', () => {
		spyOn(component, 'updateOptInOutStatus');
		component.saveChanges();
		expect(component.optlnStatus)
		.toBeTruthy();
		expect(component.updateOptInOutStatus)
		.toHaveBeenCalled();
	});

	it('should select policy', () => {
		spyOn(component, 'filterDuplicates');
		const policyName = 'HIPPA';
		component.onPolicySelected(policyName);
		expect(component.selectedPolicy)
		.toBe(policyName);
		expect(component.filterDuplicates)
		.toHaveBeenCalled();
		expect(component.showAssetsComponent)
		.toBe(true);
	});
	it('should not select policy', () => {
		const policyName = 'select';
		component.onPolicySelected(policyName);
		expect(component.showAssetsComponent)
		.toBe(false);
	});

	it('should save policy details', () => {
		let assetTaggingService: AssetTaggingService;
		assetTaggingService = TestBed.get(AssetTaggingService);
		spyOn(assetTaggingService, 'getSelectedTags').and
		.callFake(() =>
			of([{
				deviceCount: 1,
				devices: [],
				tagName: 'ABC',
				tagValue: '111',
			}]));
		component.savePolicyDetails();
		assetTaggingService.getSelectedTags()
		.subscribe(res => {
			expect(component.saveDetails.body.tags)
			.toEqual(res);
		});
	});

	it('should update OptInOut Status', () => {
		let assetTaggingService: AssetTaggingService;
		assetTaggingService = TestBed.get(AssetTaggingService);
		spyOn(assetTaggingService, 'updateOptStatus').and
		.callThrough();
		component.updateOptInOutStatus();
		expect(assetTaggingService.updateOptStatus)
		.toHaveBeenCalled();
	});

	it('should check for OptlnStatus', fakeAsync(() => {
		let routeAuthService: RouteAuthService;
		routeAuthService = TestBed.get(RouteAuthService);
		spyOn(routeAuthService, 'checkPermissions').and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
		component.checkOptlnStatus()
		.subscribe(null,
			err => {
				expect(err.status)
				.toEqual(404);
			});
	}));

	it('should handle error in get OptinOutStatus', fakeAsync(() => {
		let assetTaggingService: AssetTaggingService;
		assetTaggingService = TestBed.get(AssetTaggingService);
		spyOn(assetTaggingService, 'getOptInStatus').and
			.returnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
		component.getOptinOutStatus()
		.subscribe(null,
			res => {
				expect(res.status)
				.toEqual(404);
			});
	}));
});
