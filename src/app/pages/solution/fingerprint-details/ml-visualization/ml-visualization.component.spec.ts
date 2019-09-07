import {
	async,
	ComponentFixture,
	TestBed,
	fakeAsync,
	tick,
} from '@angular/core/testing';
import { MlVisualizationComponent } from './ml-visualization.component';
import { MlVisualizationModule } from './ml-visualization.module';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { user, ComparisonViewScenarios } from '@mock';
import { MlVisualizationService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

fdescribe('MlVisualizationComponent', () => {
	let component: MlVisualizationComponent;
	let fixture: ComponentFixture<MlVisualizationComponent>;
	let mlVisualizationService: MlVisualizationService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MlVisualizationModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
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
		})
		.compileComponents();
		mlVisualizationService = TestBed.get(MlVisualizationService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MlVisualizationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});
	/**
	 * @TODO: modify test to use UI
	 */
	it('should set empty select', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(
			mlVisualizationService,
			'getMlVisualizationDevices',
		).and
		.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.selectedDevice1)
			.toBeUndefined();
			done();
		});
	});

	it('should resolve a customerId', done => {
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.customerId)
			.toBeDefined();
			done();
		});
	});
	/**
	 * device Information response
	 */
	it('Should return the searched response', done => {
		spyOn(
			mlVisualizationService,
			'getMlVisualizationDevices',
		).and
		.returnValue(
			of(ComparisonViewScenarios[5].scenarios.GET[0].response.body),
		);
		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.mlVisualizationDevices)
			.toBeUndefined();
			done();
		});
	});
	it('should test data supplied to a render chart', () => {
		const mlVisualizationDevices = {
			count: 1,
			customerId: '729348',
			scatterPlotDevices: [
				{
					deviceId: 'NA',
					deviceName: 'Device_6_0_2_222',
					featureProfilePCA1: '0.27194448313748254',
					featureProfilePCA2: '-0.6677443614955769',
					featureProfilePCA3: '-0.26921527251480576',
					featureProfileKcluster: 0,
					fingerprintPCA1: '-0.6536891710909882',
					fingerprintPCA2: '0.4201990688658936',
					fingerprintPCA3: '-0.6212148577636525',
					lemmaFeaturePCA1: '0.12992399064088117',
					lemmaFeaturePCA2: '0.03928785789397787',
					lemmaFeaturePCA3: '-0.268887363699741',
					lemmaFeatureKcluster: 0,
					fingerprintKcluster: 0,
					featureProfileKclusterCrashrate: '11.58',
					lemmaFeatureKclusterCrashrate: '5.9',
					fingerprintKclusterCrashrate: '0.05',
					productFamily: 'Cisco_Catalyst_9',
					productId: 'C9407R',
				},
			],
		};
		component.mlVisualizationDevices = mlVisualizationDevices;
		component.selectedMode = 1;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints.length)
		.toBeGreaterThan(0);
	});

	it('should load data for features only mode', () => {
		const mlVisualizationDevices = {
			count: 1,
			customerId: '729348',
			scatterPlotDevices: [
				{
					deviceId: 'NA',
					deviceName: 'Device_6_0_2_222',
					featureProfilePCA1: '0.27194448313748254',
					featureProfilePCA2: '-0.6677443614955769',
					featureProfilePCA3: '-0.26921527251480576',
					featureProfileKcluster: 0,
					fingerprintPCA1: '-0.6536891710909882',
					fingerprintPCA2: '0.4201990688658936',
					fingerprintPCA3: '-0.6212148577636525',
					lemmaFeaturePCA1: '0.12992399064088117',
					lemmaFeaturePCA2: '0.03928785789397787',
					lemmaFeaturePCA3: '-0.268887363699741',
					lemmaFeatureKcluster: 0,
					fingerprintKcluster: 0,
					featureProfileKclusterCrashrate: '11.58',
					lemmaFeatureKclusterCrashrate: '5.9',
					fingerprintKclusterCrashrate: '0.05',
					productFamily: 'Cisco_Catalyst_9',
					productId: 'C9407R',
				},
			],
		};
		component.mlVisualizationDevices = mlVisualizationDevices;
		component.selectedMode = 2;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints.length)
		.toBeGreaterThan(0);
	});

	it('should load data for Lemma features mode', () => {
		const mlVisualizationDevices = {
			count: 1,
			customerId: '729348',
			scatterPlotDevices: [
				{
					deviceId: 'NA',
					deviceName: 'Device_6_0_2_222',
					featureProfilePCA1: '0.27194448313748254',
					featureProfilePCA2: '-0.6677443614955769',
					featureProfilePCA3: '-0.26921527251480576',
					featureProfileKcluster: 0,
					fingerprintPCA1: '-0.6536891710909882',
					fingerprintPCA2: '0.4201990688658936',
					fingerprintPCA3: '-0.6212148577636525',
					lemmaFeaturePCA1: '0.12992399064088117',
					lemmaFeaturePCA2: '0.03928785789397787',
					lemmaFeaturePCA3: '-0.268887363699741',
					lemmaFeatureKcluster: 0,
					fingerprintKcluster: 0,
					featureProfileKclusterCrashrate: '11.58',
					lemmaFeatureKclusterCrashrate: '5.9',
					fingerprintKclusterCrashrate: '0.05',
					productFamily: 'Cisco_Catalyst_9',
					productId: 'C9407R',
				},
			],
		};
		component.mlVisualizationDevices = mlVisualizationDevices;
		component.selectedMode = 3;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints.length)
		.toBeGreaterThan(0);
	});

	it('should not load data when device list is not available', () => {
		const mlVisualizationDevices = null;
		component.mlVisualizationDevices = mlVisualizationDevices;
		component.selectedMode = 1;
		component.updateScatterPlotDataPoints();
		expect(component.scatterPlotDataPoints)
		.toBeUndefined();
	});

	it('should set selected device in the Asset Group 1', () => {
		const mlVisualizationDevices = {
			count: 1,
			customerId: '729348',
			scatterPlotDevices: [
				{
					deviceId: 'TestDevice',
					deviceName: 'Device_6_0_2_222',
					featureProfilePCA1: '0.27194448313748254',
					featureProfilePCA2: '-0.6677443614955769',
					featureProfilePCA3: '-0.26921527251480576',
					featureProfileKcluster: 0,
					fingerprintPCA1: '-0.6536891710909882',
					fingerprintPCA2: '0.4201990688658936',
					fingerprintPCA3: '-0.6212148577636525',
					lemmaFeaturePCA1: '0.12992399064088117',
					lemmaFeaturePCA2: '0.03928785789397787',
					lemmaFeaturePCA3: '-0.268887363699741',
					lemmaFeatureKcluster: 0,
					fingerprintKcluster: 0,
					featureProfileKclusterCrashrate: '11.58',
					lemmaFeatureKclusterCrashrate: '5.9',
					fingerprintKclusterCrashrate: '0.05',
					productFamily: 'Cisco_Catalyst_9',
					productId: 'C9407R',
				},
			],
		};
		component.mlVisualizationDevices = mlVisualizationDevices;
		component.selectedMode = 3;
		component.selectedDevice = 'TestDevice';
		component.requestForm.controls.selectedGroup.setValue('group1');
		component.updateScatterPlotDataPoints();
		expect(component.selectedDevice1.deviceId)
		.toEqual('TestDevice');
	});

	it('should set selected device in the Asset Group 2', () => {
		const mlVisualizationDevices = {
			count: 1,
			customerId: '729348',
			scatterPlotDevices: [
				{
					deviceId: 'TestDevice',
					deviceName: 'Device_6_0_2_222',
					featureProfilePCA1: '0.27194448313748254',
					featureProfilePCA2: '-0.6677443614955769',
					featureProfilePCA3: '-0.26921527251480576',
					featureProfileKcluster: 0,
					fingerprintPCA1: '-0.6536891710909882',
					fingerprintPCA2: '0.4201990688658936',
					fingerprintPCA3: '-0.6212148577636525',
					lemmaFeaturePCA1: '0.12992399064088117',
					lemmaFeaturePCA2: '0.03928785789397787',
					lemmaFeaturePCA3: '-0.268887363699741',
					lemmaFeatureKcluster: 0,
					fingerprintKcluster: 0,
					featureProfileKclusterCrashrate: '11.58',
					lemmaFeatureKclusterCrashrate: '5.9',
					fingerprintKclusterCrashrate: '0.05',
					productFamily: 'Cisco_Catalyst_9',
					productId: 'C9407R',
				},
			],
		};
		component.mlVisualizationDevices = mlVisualizationDevices;
		component.selectedMode = 3;
		component.selectedDevice = 'TestDevice';
		component.requestForm.controls.selectedGroup.setValue('group2');
		component.updateScatterPlotDataPoints();
		expect(component.selectedDevice2.deviceId)
		.toEqual('TestDevice');
	});

	it('should set list of devices for Group1', () => {
		const scatterPlotDevices = [];
		scatterPlotDevices.push({
			deviceId: 'NA',
			deviceName: 'Device_6_0_2_222',
		});
		component.updateDeviceList(scatterPlotDevices);
		expect(component.listOfDevices1)
		.toBe(scatterPlotDevices);
	});

	it('should set list of devices for Group2', () => {
		const scatterPlotDevices = [];
		component.requestForm.controls.selectedGroup.setValue('group2');
		scatterPlotDevices.push({
			deviceId: 'NA',
			deviceName: 'Device_6_0_2_222',
		});
		component.updateDeviceList(scatterPlotDevices);
		expect(component.listOfDevices2)
		.toBe(scatterPlotDevices);
	});

	it('should check ml show Device Comparison', fakeAsync(() => {
		spyOn(component, 'showDeviceComparison');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="CompareButton"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.showDeviceComparison)
		.toHaveBeenCalledTimes(1);
	}));

	it('should reset all filter values', () => {
		component.resetFilterForm();
		expect(component.searchedDevice)
		.toBeNull();
		expect(component.selectedDevice1)
		.toBeNull();
		expect(component.selectedDevice2)
		.toBeNull();
		expect(component.listOfDevices1)
		.toBeNull();
		expect(component.listOfDevices2)
		.toBeNull();
	});
});
