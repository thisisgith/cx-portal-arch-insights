import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { QuickTourComponent } from './quick-tour.component';
import { QuickTourModule } from './quick-tour.module';

describe('QuickTourComponent', () => {
	let component: QuickTourComponent;
	let fixture: ComponentFixture<QuickTourComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [QuickTourModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(QuickTourComponent);
		component = fixture.componentInstance;
		component.steps = [
			{
				stepIndex: 2,
			},
			{
				stepIndex: 1,
			},
			{
				stepIndex: 6,
			},
		];

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should not set indicies if no steps', () => {
		component.steps = null;
		component.ngOnInit();
		fixture.detectChanges();
		expect(component)
			.toBeTruthy();
		expect(component.currentIndex)
			.toBeUndefined();
		expect(component.lastIndex)
			.toBeUndefined();
	});

	it('should close', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.open)
				.toBeTruthy();

			component.close();

			expect(component.open)
				.toBeFalsy();
			done();
		});
	});

	it('should set first and last index', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();

			expect(component.currentIndex)
				.toBe(1);
			expect(component.lastIndex)
				.toBe(6);
			done();
		});
	});

	it('should go to next step', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.currentIndex)
				.toBe(1);

			component.nextStep();
			expect(component.open)
				.toBeTruthy();
			expect(component.currentIndex)
				.toBe(2);

			component.nextStep();

			expect(component.currentIndex)
				.toBe(6);
			expect(component.open)
				.toBeTruthy();

			component.nextStep();
			expect(component.open)
				.toBeFalsy();
			done();
		});
	});

	it('should get correct translate for step container', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.getTranslate({ stepPos: 'left' }))
				.toBe('translate(-100%, -50%)');
			expect(component.getTranslate({ stepPos: 'right' }))
				.toBe('translate(0%, -50%)');
			expect(component.getTranslate({ stepPos: 'top' }))
				.toBe('translate(-50%, -50%)');
			expect(component.getTranslate({ stepPos: 'bottom' }))
				.toBe('translate(-50%, 50%)');
			expect(component.getTranslate({ }))
				.toBe('translate(-50%, 50%)');
			done();
		});
	});

	it('should get correct left translate', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.getLeft({
				data: {
					left: 100,
				},
				stepPos: 'left',
			}))
			.toBe('80px');
			expect(component.getLeft({
				data: {
					left: 100,
				},
				stepPos: 'right',
			}))
			.toBe('120px');
			expect(component.getLeft({
				data: {
					left: 100,
				},
				stepPos: 'top',
			}))
			.toBe('100px');
			expect(component.getLeft({
				data: {
					left: 100,
				},
				stepPos: 'bottom',
			}))
			.toBe('100px');
			expect(component.getLeft({
				data: {
					left: 100,
				},
			}))
			.toBe('100px');
			expect(component.getLeft({ }))
			.toBe('0px');
			done();
		});
	});

	it('should get correct top translate', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.getTop({
				data: {
					top: 100,
				},
				stepPos: 'left',
			}))
			.toBe('100px');
			expect(component.getTop({
				data: {
					top: 100,
				},
				stepPos: 'right',
			}))
			.toBe('100px');
			expect(component.getTop({
				data: {
					top: 100,
				},
				stepPos: 'top',
			}))
			.toBe('80px');
			expect(component.getTop({
				data: {
					top: 100,
				},
				stepPos: 'bottom',
			}))
			.toBe('120px');
			expect(component.getTop({
				data: {
					top: 100,
				},
			}))
			.toBe('100px');
			expect(component.getTop({ }))
			.toBe('0px');
			done();
		});
	});

	it('should get correct arrow top translate', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.getArrowTop({ stepPos: 'top' }, 50))
				.toBe('100%');
			expect(component.getArrowTop({ stepPos: 'bottom' }, 50))
				.toBe('0%');
			expect(component.getArrowTop({ stepPos: 'left' }, 50))
				.toBe('50%');
			expect(component.getArrowTop({ stepPos: 'right' }, 50))
				.toBe('50%');
			expect(component.getArrowTop({ }, 50))
				.toBe('50%');
			expect(component.getArrowTop({ }, null))
				.toBe('0%');
			done();
		});
	});

	it('should get correct arrow left translate', done => {
		fixture.whenStable()
		.then(() => {
			fixture.detectChanges();
			expect(component.getArrowLeft({ stepPos: 'top' }, 50))
				.toBe('50%');
			expect(component.getArrowLeft({ stepPos: 'bottom' }, 50))
				.toBe('50%');
			expect(component.getArrowLeft({ stepPos: 'left' }, 50))
				.toBe('100%');
			expect(component.getArrowLeft({ stepPos: 'right' }, 50))
				.toBe('0%');
			expect(component.getArrowLeft({ }, 50))
				.toBe('50%');
			expect(component.getArrowLeft({ }, null))
				.toBe('0%');
			done();
		});
	});
});
