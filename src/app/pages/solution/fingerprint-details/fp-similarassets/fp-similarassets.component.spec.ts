
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FpSimilarAssetsComponent } from './fp-similarassets.component';
import { FpSimilarAssetsModule } from './fp-similarassets.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FpIntelligenceService } from '@sdp-api';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user, ComparisonViewScenarios } from '@mock';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('FpSimilarassetsComponent', () => {
	let component: FpSimilarAssetsComponent;
	let fixture: ComponentFixture<FpSimilarAssetsComponent>;
	let fpIntelligenceService: FpIntelligenceService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				FpSimilarAssetsModule,
				HttpClientTestingModule,
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
		fpIntelligenceService = TestBed.get(FpIntelligenceService);
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FpSimilarAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should define tableOption on ngOnInit', () => {
		const spy = spyOn(fpIntelligenceService, 'getSimilarDevices').and
			.callThrough();
		component.ngOnInit();
		fixture.detectChanges();
		expect(component.tableOptions)
			.toBeDefined();
		expect(component.similarDevicesData)
			.toBeDefined();
		component.loadSimilarDevicesData();
		expect(component.seriesDataLoading)
			.toBeTruthy();
		expect(spy)
			.toHaveBeenCalled();
	});

	it('should getSimilarDevices for asset change', () => {
		const fakeInput: SimpleChanges = {
			asset: new SimpleChange(null, { productId: 'Hello', deviceId: 'Hello' }, true),
		};
		const spy = spyOn(fpIntelligenceService, 'getSimilarDevices').and
			.callThrough();
		component.ngOnChanges(fakeInput);
		expect(component.deviceId)
			.toBeDefined();
		expect(component.productId)
			.toBeDefined();
		expect(component.deviceId)
			.toEqual('Hello');
		expect(component.productId)
			.toEqual('Hello');
		expect(spy)
			.toHaveBeenCalled();
	});

	it('should not getSimilarDevices for asset null', () => {
		const fakeInput: SimpleChanges = {
			asset: null,
		};
		const spy = spyOn(fpIntelligenceService, 'getSimilarDevices').and
			.callThrough();
		component.ngOnChanges(fakeInput);
		expect(spy)
			.toHaveBeenCalledTimes(0);
	});

	it('should change page value on onPagerUpdated', () => {
		const fakePageInfo = {
			page: 10,
		};
		const spy = spyOn(fpIntelligenceService, 'getSimilarDevices').and
			.callThrough();
		component.onPagerUpdated(fakePageInfo);
		expect(component.page)
			.toEqual(10);
		expect(spy)
			.toHaveBeenCalled();
	});

	it('should selectedDevice2 on active tableRowData', () => {
		const fakeTableRoeData = {
			active: true,
		};
		component.onTableRowSelection(fakeTableRoeData);
		expect(component.selectedDevice2)
			.toBeDefined();
		expect(component.selectedDevice2)
			.toEqual(fakeTableRoeData);
	});

	it('should not selectedDevice2 on inactive tableRowData', () => {
		const fakeTableRoeData = {
			active: false,
		};
		component.selectedDevice2 = {
			random: 10,
		};
		component.onTableRowSelection(fakeTableRoeData);
		expect(component.selectedDevice2 === fakeTableRoeData)
			.toBeFalsy();
	});

	it('should not load data if form is invalid', fakeAsync(() => {
		component.requestForm.setValue({
			deviceCount : 50,
			minMatch: 0 ,
			similarityCriteria: 'fingerprint'});
		spyOn(fpIntelligenceService, 'getSimilarDevices')
			.and
			.returnValue(of(ComparisonViewScenarios[4].scenarios.GET[0].response.body));
		component.ngOnInit();
		tick(1000);
		fixture.detectChanges();
		expect(fpIntelligenceService.getSimilarDevices).not
			.toHaveBeenCalled();
	}));

	it('should not load data if response contains empty values', done => {
		spyOn(fpIntelligenceService, 'getSimilarDevices')
		.and
		.returnValue(of(ComparisonViewScenarios[8].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.noData)
					.toBeTruthy();
				done();
			});
	});

	it('Should return the response', done => {
		spyOn(fpIntelligenceService, 'getSimilarDevices')
			.and
			.returnValue(of(ComparisonViewScenarios[7].scenarios.GET[0].response.body));
		component.ngOnInit();
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.similarDevicesData)
					.toBeDefined();
				done();
			});
	});

});
