import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BugDetailsComponent } from './bug-details.component';
import { BugDetailsModule } from './bug-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { user, CriticalBugData } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { DiagnosticsService } from '@sdp-api';
import { of } from 'rxjs';

describe('BugDetailsComponent', () => {
	let component: BugDetailsComponent;
	let fixture: ComponentFixture<BugDetailsComponent>;
	let diagnosticsService: DiagnosticsService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				MicroMockModule,
				BugDetailsModule,
				HttpClientTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {

		diagnosticsService = TestBed.get(DiagnosticsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BugDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should set the data based on the input', done => {
		component.advisory = CriticalBugData[0];
		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.ngOnInit();
		fixture.whenStable()
		.then(() => {
			expect(component.data)
				.toEqual({
					advisory: CriticalBugData[0],
				});

			done();
		});
	});

	it('should emit the advisory for the header', done => {
		component.advisory = CriticalBugData[0];
		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.details
		.subscribe((details => {
			expect(details)
				.toEqual(component.data);

			done();
		}));

		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should load the bug if only id passed', () => {
		spyOn(diagnosticsService, 'getCriticalBugs')
			.and
			.returnValue(of({ data: [CriticalBugData[0]] }));

		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.ngOnInit();
		fixture.detectChanges();

		expect(component.data)
			.toEqual({ advisory: CriticalBugData[0] });
	});

	it('should handle changing bugs', () => {
		component.advisory = CriticalBugData[0];
		component.id = CriticalBugData[0].id;
		component.customerId = user.info.customerId;

		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		fixture.detectChanges();

		expect(component.data)
			.toEqual({
				advisory: CriticalBugData[0],
			});

		component.advisory = CriticalBugData[1];
		component.id = CriticalBugData[1].id;
		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: CriticalBugData[0].id,
			},
		});

		fixture.detectChanges();
		expect(component.data)
			.toEqual({
				advisory: CriticalBugData[1],
			});
	});
});
