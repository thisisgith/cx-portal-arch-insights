import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupsComponent } from './software-groups.component';
import { SoftwareGroupsModule } from './software-groups.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVService, SoftwareGroupsResponse } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { OSVScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';

fdescribe('SoftwareGroupsComponent', () => {
	let component: SoftwareGroupsComponent;
	let fixture: ComponentFixture<SoftwareGroupsComponent>;
	let osvService: OSVService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		osvService = TestBed.get(OSVService);
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call profile groups list on init', () => {
		spyOn(osvService, 'getSoftwareGroups')
			.and
			.returnValue(of(
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

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(osvService, 'getSoftwareGroups')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.selectedSoftwareGroup = <any> OSVScenarios[1].scenarios.GET[0].response.body;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.softwareGroups)
			.toBeUndefined();
		expect(component.status.isLoading)
			.toBe(false);
		expect(component.softwareGroupsTable)
			.toBeUndefined();
	});

	it('should refresh on page change', () => {
		spyOn(osvService, 'getSoftwareGroups')
			.and
			.returnValue(of(<any> OSVScenarios[1].scenarios.GET[0].response.body));
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
});
