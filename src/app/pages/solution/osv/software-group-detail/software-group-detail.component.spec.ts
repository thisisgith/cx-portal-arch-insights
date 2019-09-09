import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import { SoftwareGroupDetailModule } from './software-group-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVService } from '@sdp-api';
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
		const sgAssets = <any> OSVScenarios[7].scenarios.GET[0].response.body;
		const sgVersions = <any> OSVScenarios[8].scenarios.GET[0].response.body;
		const sgRecommendations = <any> OSVScenarios[9].scenarios.GET[0].response.body;
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of(sgAssets));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of(sgVersions));
		spyOn(osvService, 'getSoftwareGroupRecommendations')
			.and
			.returnValue(of(sgRecommendations));
		const selectedSG = (<any> OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.selectedSoftwareGroup = selectedSG;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.softwareGroupAssets)
			.toBeDefined();
		expect(component.softwareGroupVersions)
			.toBeDefined();
		expect(component.machineRecommendations)
			.toBeDefined();
		expect(component.recommendations)
			.toBeDefined();
		expect(component.softwareGroupAssetsTable)
			.toBeDefined();
		expect(component.softwareGroupVersionsTable)
			.toBeDefined();
	});

	it('should reload softwaregroup assets and version on ngOnChanges', () => {
		spyOn(osvService, 'getSoftwareGroupAssets')
			.and
			.returnValue(of(<any> OSVScenarios[7].scenarios.GET[0].response.body));
		spyOn(osvService, 'getSoftwareGroupVersions')
			.and
			.returnValue(of(<any> OSVScenarios[8].scenarios.GET[0].response.body));
		const selectedSG = (<any> OSVScenarios[1].scenarios.GET[0].response.body).uiProfileList[0];
		component.selectedSoftwareGroup = selectedSG;
		component.ngOnChanges({
			selectedSoftwareGroup: {
				currentValue: selectedSG,
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
		component.ngOnChanges({
			tabIndex: {
				currentValue: 2,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: undefined,
			},
		});
		fixture.detectChanges();
		expect(component.tabIndex)
			.toEqual(2);
	});
});
