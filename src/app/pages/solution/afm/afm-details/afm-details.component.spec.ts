import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AfmDetailsComponent } from './afm-details.component';
import { AfmDetailsModule } from './afm-details.module';
import { of } from 'rxjs';
import { AfmScenarios } from '@mock';
import {
	AfmService,
	AfmSearchParams, Alarm, AfmResponse,
} from '@sdp-api';
import { SimpleChanges, SimpleChange } from '@angular/core';

describe('AfmDetailsComponent', () => {
	let component: AfmDetailsComponent;
	let fixture: ComponentFixture<AfmDetailsComponent>;
	const mockAlarm: Alarm = new Object();
	const mockSearchParams: AfmSearchParams = new Object();
	const mockResponse: AfmResponse = new Object();
	let mockAfmService: AfmService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [AfmDetailsModule, HttpClientTestingModule],
			providers: [AfmService],
		});
	});

	beforeEach(async(() => {
		mockAfmService = TestBed.get(AfmService);
		spyOn(mockAfmService, 'ignoreEvent')
			.and
			.returnValue(of(AfmScenarios[1].scenarios.POST[0].response.body));
	}));

	beforeEach(() => {
		window.localStorage.clear();
		fixture = TestBed.createComponent(AfmDetailsComponent);
		component = fixture.componentInstance;
		component.alarm = mockAlarm;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should connect to asset details', () => {
		spyOn(component.selectedAsset, 'emit');
		fixture.detectChanges();
		mockAlarm.serialNumber = '123';
		component.connectToAssetDetails(mockAlarm);
		expect(component.selectedAsset.emit)
			.toHaveBeenCalledWith(mockAlarm);
	});

	it('should create the ignore event', () => {
		mockResponse.statusMessage = 'ok';
		mockAfmService = TestBed.get(AfmService);
		mockAlarm.customerId = '1234';
		mockAlarm.faultIC = '%Fault';
		mockAlarm.status = 'IGNORED';
		fixture.detectChanges();
		mockSearchParams.customerId = mockAlarm.customerId;
		mockSearchParams.faultIC = mockAlarm.faultIC;
		component.toggleEvent(mockAlarm);
		expect(mockAfmService.ignoreEvent)
			.toBeTruthy();

		mockAlarm.status = 'NOT IGNORED';
		component.toggleEvent(mockAlarm);
		fixture.detectChanges();
		expect(mockAfmService.revertIgnoreEvent)
			.toBeTruthy();
	});

	it('should ignored the event and revert the ignored event', () => {

		spyOn(mockAfmService, 'revertIgnoreEvent')
			.and
			.returnValue(of(AfmScenarios[9].scenarios.POST[0].response.body));
		mockAlarm.customerId = '1234';
		mockAlarm.faultIC = '%Fault';
		mockAlarm.status = 'Success';

		component.toggleEvent(mockAlarm);
		fixture.detectChanges();

		expect(mockAfmService.ignoreEvent)
			.toHaveBeenCalled();

		mockAlarm.status = 'Ignored';
		component.toggleEvent(mockAlarm);
		fixture.detectChanges();

		expect(mockAfmService.revertIgnoreEvent)
			.toHaveBeenCalled();
	});

	it('should failed to ignored the event and failed to revert the ignored event', () => {

		spyOn(mockAfmService, 'revertIgnoreEvent')
			.and
			.returnValue(of(AfmScenarios[9].scenarios.POST[0].response.body));
		mockAlarm.customerId = '1234';
		mockAlarm.faultIC = '%Fault';
		mockAlarm.status = 'Success';

		component.toggleEvent(mockAlarm);
		fixture.detectChanges();

		expect(mockAfmService.ignoreEvent)
			.toHaveBeenCalled();

		mockAlarm.status = 'Ignored';
		component.toggleEvent(mockAlarm);
		fixture.detectChanges();

		expect(mockAfmService.revertIgnoreEvent)
			.toHaveBeenCalled();
	});

	it('should change status on changes', () => {
		const changes: SimpleChanges = {
			alarm: new SimpleChange({ }, { status: 'Success' }, false),
		};
		component.ngOnChanges(changes);
		expect(component.status)
		.toBeFalsy();
	});

	it('should change status to true on changes', () => {
		const changes: SimpleChanges = {
			alarm: new SimpleChange({ }, { status: 'Ignored' }, false),
		};
		component.ngOnChanges(changes);
		expect(component.status)
		.toBeTruthy();
	});
});
