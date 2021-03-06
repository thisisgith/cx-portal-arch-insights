import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SoftwareGroupsComponent } from './software-groups.component';
import { SoftwareGroupsModule } from './software-groups.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVService, SoftwareGroupsResponse } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OSVScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import * as _ from 'lodash-es';
describe('SoftwareGroupsComponent', () => {
	let component: SoftwareGroupsComponent;
	let fixture: ComponentFixture<SoftwareGroupsComponent>;
	let osvService: OSVService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		component.softwareGroupsCount = 1;
		osvService = TestBed.get(OSVService);
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call profile groups list on init', () => {
		jest.spyOn(osvService, 'getSoftwareGroups')
			.mockReturnValue(of(
				<SoftwareGroupsResponse> OSVScenarios[1].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getSoftwareGroups)
			.toHaveBeenCalled();
		expect(component.softwareGroupsTable)
			.toBeDefined();
		expect(component.softwareGroups)
			.toBeDefined();
		expect(component.status.isLoading)
			.toBe(false);
	});

	it('should set null values on request errors', fakeAsync(() => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		jest.spyOn(osvService, 'getSoftwareGroups')
			.mockReturnValue(throwError(new HttpErrorResponse(error)));
		component.selectedSoftwareGroup = <any> OSVScenarios[1].scenarios.GET[0].response.body;
		component.ngOnInit();
		tick();
		fixture.detectChanges();
		expect(component.softwareGroups)
			.toBeUndefined();
		expect(component.status.isLoading)
			.toBe(false);
		expect(component.softwareGroupsTable)
			.toBeUndefined();
	}));

	it('should refresh on page change', () => {
		jest.spyOn(osvService, 'getSoftwareGroups')
			.mockReturnValue(of(<any> OSVScenarios[1].scenarios.GET[0].response.body));
		component.onPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(component.softwareGroupsParams.pageIndex)
			.toEqual(3);
		expect(osvService.getSoftwareGroups)
			.toHaveBeenCalled();
	});

	it('should select/deselect a case on row click', () => {
		component.softwareGroups = (<any> OSVScenarios[1].scenarios.GET[0].response.body)
			.uiProfileList;
		const rowCase = (<any> OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.onRowSelect(rowCase);
		fixture.detectChanges();
		expect(component.selectedSoftwareGroup)
			.toBe(rowCase);
		component.onRowSelect(rowCase);
		expect(component.selectedSoftwareGroup)
			.toBeNull();
	});

	it('should set the optimal version if the selectedSoftwareGroup has statusUpdated', () => {
		const softwareGroups = (<any> OSVScenarios[1].scenarios.GET[0].response.body);
		jest.spyOn(osvService, 'getSoftwareGroups')
			.mockReturnValue(of(softwareGroups));
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.softwareGroups)
			.toEqual(softwareGroups.uiProfileList);
		const item = softwareGroups.uiProfileList[0];
		component.onRowSelect(item);
		fixture.detectChanges();
		expect(item.rowSelected)
			.toBeTruthy();
		expect(item.optimalVersion)
			.toBeNull();
		const selectedSG = _.cloneDeep(item);
		selectedSG.statusUpdated = true;
		selectedSG.optimalVersion = '1.1';
		component.ngOnChanges({
			selectedSoftwareGroup: {
				currentValue: selectedSG,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(item.optimalVersion)
			.toEqual('1.1');
	});

	it('should refresh on filters change ', fakeAsync(() => {
		component.ngOnChanges({
			filters: {
				currentValue: {
					recommendationType: ['expert'],
				},
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(component.softwareGroupsParams.filter)
			.toBe('recommendationType:expert');
		component.ngOnChanges({
			filters: {
				currentValue: {
					recommendationType: ['expert', 'automated', 'none'],
				},
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		tick();
		fixture.detectChanges();
		expect(component.softwareGroupsParams.filter)
			.toBe('recommendationType:expert,automated,none');
	}));

});
