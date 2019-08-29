import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { environment } from '@environment';
import { DevicesSdaComponent } from './devices-sda.component';
import { DevicesSdaModule } from './devices-sda.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureReviewService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { of } from 'rxjs';

describe('DevicesSdaComponent', () => {
	let component: DevicesSdaComponent;
	let fixture: ComponentFixture<DevicesSdaComponent>;
	let service: ArchitectureReviewService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				DevicesSdaModule,
				HttpClientTestingModule,
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
		service = TestBed.get(ArchitectureReviewService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DevicesSdaComponent);
		component = fixture.componentInstance;
		spyOn(service, 'getDevicesSDA')
			.and
			.returnValue(of({ deviceSDAdatas: [] }));
		fixture = TestBed.createComponent(DevicesSdaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getDevicesSDA', () => {
		component.getSdaDeviceData();
		expect(service.getDevicesSDA)
			.toHaveBeenCalled();
	});

});
