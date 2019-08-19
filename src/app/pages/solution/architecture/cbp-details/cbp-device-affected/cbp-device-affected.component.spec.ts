import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';
import { CbpDeviceAffectedModule } from './cbp-device-affected.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CbpDeviceAffectedComponent', () => {
	let component: CbpDeviceAffectedComponent;
	let fixture: ComponentFixture<CbpDeviceAffectedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpDeviceAffectedModule,
				HttpClientTestingModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpDeviceAffectedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
