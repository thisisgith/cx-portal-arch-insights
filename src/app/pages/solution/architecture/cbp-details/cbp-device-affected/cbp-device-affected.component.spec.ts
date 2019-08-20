import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpDeviceAffectedComponent } from './cbp-device-affected.component';
import { CbpDeviceAffectedModule } from './cbp-device-affected.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of } from 'rxjs';

describe('CbpDeviceAffectedComponent', () => {
	let component: CbpDeviceAffectedComponent;
	let fixture: ComponentFixture<CbpDeviceAffectedComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpDeviceAffectedModule,
				HttpClientTestingModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getAllCBPDeviceAffected')
			.and
			.returnValue(of({ assetDatas: [] }));
		fixture = TestBed.createComponent(CbpDeviceAffectedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

});
