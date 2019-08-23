import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FingerprintBodyComponent } from './fingerprint-body.component';
import { FingerprintBodyModule } from './fingerprint-body.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';

fdescribe('FingerprintBodyComponent', () => {
	let component: FingerprintBodyComponent;
	let fixture: ComponentFixture<FingerprintBodyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FingerprintBodyModule,
				HttpClientTestingModule,
				CuiTableModule,
				CuiPagerModule,
				RouterTestingModule,
				MicroMockModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FingerprintBodyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		component.asset = {
			deviceId : 'NA,602175,C9407R,NA',
			productId : 'C9407R',
		};
		expect(component)
			.toBeTruthy();
	});
});
