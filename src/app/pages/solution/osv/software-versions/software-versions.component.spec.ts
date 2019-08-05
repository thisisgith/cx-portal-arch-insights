import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareVersionsComponent } from './software-versions.component';
import { SoftwareVersionsModule } from './software-versions.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { of } from 'rxjs';
import { OSVScenarios } from '@mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('SoftwareVersionsComponent', () => {
	let component: SoftwareVersionsComponent;
	let fixture: ComponentFixture<SoftwareVersionsComponent>;
	let osvService: OSVService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareVersionsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
			.compileComponents();
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
			.returnValue(of());
		component.ngOnInit();
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
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
	});

	it('should refresh on page change', () => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of());
		component.onPageChanged({ page: 2 });
		fixture.detectChanges();
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
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
			.toBe('1-10');

	});
});
