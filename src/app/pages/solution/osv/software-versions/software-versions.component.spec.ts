import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareVersionsComponent } from './software-versions.component';
import { SoftwareVersionsModule } from './software-versions.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { of, throwError } from 'rxjs';
import { OSVScenarios, user } from '@mock';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environment';

describe('SoftwareVersionsComponent', () => {
	let component: SoftwareVersionsComponent;
	let fixture: ComponentFixture<SoftwareVersionsComponent>;
	let osvService: OSVService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareVersionsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		});
	});

	beforeEach(async(() => {
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareVersionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getVersions list on init', () => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of(<any> OSVScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
		expect(component.softwareVersionsTable)
			.toBeDefined();
		expect(component.status.isLoading)
			.toBe(false);
	});

	it('should handle getVersions error', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(component, 'buildTable');
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
		expect(component.softwareVersionsTable)
			.toBeUndefined();
		expect(component.status.isLoading)
			.toBe(false);
	});

	it('should refresh on sort', () => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of());
		component.onTableSortingChanged({
			key: 'Key1',
			value: 'Value1',
		});
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
		expect(component.softwareVersionsParams.sort)
			.toBe('Key1');
		expect(component.softwareVersionsParams.pageIndex)
			.toBe(1);
	});

	it('should refresh on page change', () => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of());
		component.onPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
		expect(component.softwareVersionsParams.pageIndex)
			.toBe(3);
	});

	it('should call the getVersion with require params', () => {
		expect(component.softwareVersionsParams.customerId)
			.toBeDefined();
		expect(component.softwareVersionsParams.pageIndex)
			.toBeDefined();
		expect(component.softwareVersionsParams.pageSize)
			.toBeDefined();
		expect(component.softwareVersionsParams.sort)
			.toBeDefined();
		expect(component.softwareVersionsParams.sortOrder)
			.toBeDefined();
	});

	it('should show pagination info if getVersion call is success', () => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of(<any> OSVScenarios[2].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
		expect(component.paginationCount)
			.toBe('1-6');
		expect(component.softwareVersionsTable)
			.toBeDefined();
		expect(component.pagination.total)
			.toEqual(6);
	});

	it('should show pagination info if getVersion call is success', () => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of(<any> OSVScenarios[6].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
		expect(component.paginationCount)
			.toBe('1-10');
		expect(component.softwareVersionsTable)
			.toBeDefined();
		expect(component.pagination.total)
			.toEqual(100);
	});
});
