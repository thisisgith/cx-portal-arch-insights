import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { DevicesWithExceptionsModule } from './devices-with-exceptions.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ArchitectureService } from '@sdp-api';
import { CuiTableModule, CuiPagerModule, CuiSpinnerModule } from '@cisco-ngx/cui-components';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';

describe('DevicesWithExceptionsComponent', () => {
	let component: DevicesWithExceptionsComponent;
	let fixture: ComponentFixture<DevicesWithExceptionsComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesWithExceptionsModule,
				HttpClientTestingModule,
				CuiTableModule,
				CuiPagerModule,
				CuiSpinnerModule,
				MicroMockModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getAllAssetsWithExceptions')
			.and
			.returnValue(of({ TotalCounts: 1000, AssetsExceptionDetails: [] }));
		fixture = TestBed.createComponent(DevicesWithExceptionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getAllAssetsWithExceptions on init', () => {
		component.getAllAssetsWithExceptions();
		expect(service.getCBPSeverityList)
			.toHaveBeenCalled();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit : 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.params.page)
		.toBe(1);
	});

});
