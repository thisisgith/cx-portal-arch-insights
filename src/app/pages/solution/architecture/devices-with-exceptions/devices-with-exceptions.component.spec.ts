import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesWithExceptionsComponent } from './devices-with-exceptions.component';
import { DevicesWithExceptionsModule } from './devices-with-exceptions.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ArchitectureService } from '@sdp-api';
import { RouterTestingModule } from '@angular/router/testing';

describe('DevicesWithExceptionsComponent', () => {
	let component: DevicesWithExceptionsComponent;
	let fixture: ComponentFixture<DevicesWithExceptionsComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DevicesWithExceptionsModule,
				HttpClientTestingModule,
				RouterTestingModule],
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
		expect(service.getAllAssetsWithExceptions)
			.toHaveBeenCalled();
	});
});
