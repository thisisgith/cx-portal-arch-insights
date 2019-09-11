import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FingerprintBodyComponent } from './fingerprint-body.component';
import { FingerprintBodyModule } from './fingerprint-body.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('FingerprintBodyComponent', () => {
	let component: FingerprintBodyComponent;
	let fixture: ComponentFixture<FingerprintBodyComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FingerprintBodyModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FingerprintBodyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		component.asset = {
			deviceId: 'NA,602175,C9407R,NA',
			productId: 'C9407R',
		};
		expect(component)
			.toBeTruthy();
	});

	it('should only set selectedDevices on ngOnChanges if value', () => {
		component.ngOnChanges({
			asset: {
				currentValue: { deviceId: 1, productId: 1 },
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.selectedDevice)
			.toBeDefined();
		expect(component.selectedAsset)
			.toBeDefined();
		expect(component.selectedDevices)
			.toBeDefined();
	});

	it('should not set selectedDevices on ngOnChanges if no value', () => {
		component.ngOnChanges({
			asset: {
				currentValue: null,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		fixture.detectChanges();
		expect(component.selectedDevice)
			.toBeUndefined();
		expect(component.selectedAsset)
			.toBeUndefined();
		expect(component.selectedDevices)
			.toBeUndefined();
	});

});
