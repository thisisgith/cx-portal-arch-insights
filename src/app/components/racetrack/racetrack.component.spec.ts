import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RacetrackComponent } from './racetrack.component';
import { RacetrackComponentModule } from './racetrack.module';

describe('RacetrackComponent', () => {
	let component: RacetrackComponent;
	let fixture: ComponentFixture<RacetrackComponent>;
	let de: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RacetrackComponentModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RacetrackComponent);
		component = fixture.componentInstance;

		component.stage = 'onboard';

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('assets', () => {
		it('should show the racetrack', () => {
			de = fixture.debugElement.query(By.css('#racetrack-composite'));

			expect(de)
				.toBeTruthy();
		});
		it('should show the racecar', () => {
			de = fixture.debugElement.query(By.css('#racecar'));

			expect(de)
				.toBeTruthy();
		});
		it('should show the progress bar', () => {
			de = fixture.debugElement.query(By.css('#progress'));

			expect(de)
				.toBeTruthy();
		});
	});

	describe('interactions', () => {
		it('should move forward', () => {
			const current = component.current;
			component.zoomToNext();
			const next = component.current;

			expect(component.stages.indexOf(current))
				.toBeLessThan(component.stages.indexOf(next));
		});

		it('should move forward', () => {
			const current = component.current;
			component.zoomToPrevious();
			const prev = component.current;

			expect(component.stages.indexOf(current))
				.toBeGreaterThan(component.stages.indexOf(prev));
		});

		it('should move to an arbitrary stage', () => {
			const stageName = 'adopt';
			component.zoomToStage(stageName);
			expect(component.current)
				.toEqual(stageName);
		});

		it('should expand the progress bar when told to', () => {
			const startProgress = component.progressSoFar;
			component.zoomToNext(true);
			const endProgress = component.progressSoFar;
			expect(startProgress)
				.toBeLessThan(endProgress);
		});
	});

	it('should reset if at the end', () => {
		const stageName = component.stages[component.stages.length - 1];
		component.zoomToStage(stageName);

		expect(component.current)
			.toEqual(stageName);

		component.zoomToNext(true);

		fixture.detectChanges();

		expect(component.current)
			.toEqual(component.stages[0]);
	});

	it('should go back if at the beginning', () => {
		const stageName = component.stages[0];

		component.zoomToStage(stageName);

		expect(component.current)
			.toEqual(stageName);

		component.zoomToPrevious(true);

		fixture.detectChanges();

		expect(component.current)
			.toEqual(component.stages[component.stages.length - 1]);
	});
});
