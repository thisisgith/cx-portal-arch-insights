import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CbpTbdComponent } from './cbp-tbd.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of } from 'rxjs';
import { CbpTbdModule } from './cbp-tbd.module';

describe('CbpTbdComponent', () => {
	let component: CbpTbdComponent;
	let fixture: ComponentFixture<CbpTbdComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpTbdModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getAllCBPExceptionDetails')
			.and
			.returnValue(of({ exceptionDatas: [] }));
		fixture = TestBed.createComponent(CbpTbdComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getAllCBPExceptionDetails', () => {
		component.getData();
		expect(service.getAllCBPExceptionDetails)
			.toHaveBeenCalled();
	});

	it('should update pagination params', () => {
		const pageEvent = { page: 1, limit : 10 };
		component.onPagerUpdated(pageEvent);
		expect(component.params.page)
		.toBe(1);
	});
});
