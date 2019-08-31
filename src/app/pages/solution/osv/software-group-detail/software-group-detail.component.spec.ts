import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import { SoftwareGroupDetailModule } from './software-group-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVService, SoftwareGroupAssetsResponse, SoftwareGroupVersionsResponse, SoftwareGroup } from '@sdp-api';
import { OSVScenarios } from '@mock';
import { of } from 'rxjs';

describe('SoftwareGroupDetailComponent', () => {
	let component: SoftwareGroupDetailComponent;
	let fixture: ComponentFixture<SoftwareGroupDetailComponent>;
	let osvService: OSVService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupDetailModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should load softwaregroup asset and versions', () => {
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of(<SoftwareGroupAssetsResponse>OSVScenarios[7].scenarios.GET[0].response.body));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of(<SoftwareGroupVersionsResponse>OSVScenarios[8].scenarios.GET[0].response.body));
		const selectedSoftwareGroup = (<any>OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.selectedSoftwareGroup = selectedSoftwareGroup;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.softwareGroupAssets)
			.toBeDefined();
		expect(component.softwareGroupVersions)
			.toBeDefined();
		expect(component.softwareGroupAssetsTable)
			.toBeDefined();
		expect(component.softwareGroupVersionsTable)
			.toBeDefined();
	});

	it('should reload softwaregroup assets and version on ngOnChanges', () => {
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of(<SoftwareGroupAssetsResponse>OSVScenarios[7].scenarios.GET[0].response.body));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of(<SoftwareGroupVersionsResponse>OSVScenarios[8].scenarios.GET[0].response.body));
		const selectedSoftwareGroup = (<any>OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0]
		component.selectedSoftwareGroup = selectedSoftwareGroup;
		component.ngOnChanges({
			selectedProfileGroup: {
				currentValue: selectedSoftwareGroup,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(osvService.getSoftwareGroupAssets)
			.toHaveBeenCalled();
		expect(osvService.getSoftwareGroupVersions)
			.toHaveBeenCalled();
	});

	it('should set the tabIndex on ngOnChanges', () => {
		component.ngOnChanges({
			tabIndex: {
				currentValue: undefined,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		});
		fixture.detectChanges();
		expect(component.tabIndex)
			.toEqual(0);
	});
});
