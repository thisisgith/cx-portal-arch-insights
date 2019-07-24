import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { SettingsModule } from './settings.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { IEHealthStatusResponseModel } from '@sdp-api';
import { HealthStatusScenarios } from '@mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('SettingsComponent', () => {
	let component: SettingsComponent;
	let fixture: ComponentFixture<SettingsComponent>;

	const locationStub = {
		back: jasmine.createSpy('back'),
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				HttpClientTestingModule,
				SettingsModule,
			],
			providers: [
				{
					provide: Location,
					useValue: locationStub,
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('test get resources', () => {
		it('should handle correct input', () => {
			expect(component.getResourcePercent('10', '100gb'))
				.toEqual(10);
		});

		it('should handle bad input', () => {
			expect(component.getResourcePercent('10', undefined))
				.toEqual(NaN);
		});
	});

	describe('handle test data', () => {
		it('should handle test data', () => {
			component.cpData = <IEHealthStatusResponseModel[]>
				HealthStatusScenarios[0].scenarios.GET[0].response.body;
			component.handleData();
		});
	});
});
