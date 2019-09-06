import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RacetrackComponent, stages } from './racetrack.component';
import { RacetrackComponentModule } from './racetrack.module';

describe('RacetrackComponent', () => {
	let component: RacetrackComponent;
	let fixture: ComponentFixture<RacetrackComponent>;
	let de: DebugElement;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [RacetrackComponentModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RacetrackComponent);
		component = fixture.componentInstance;

		component.stage = 'onboard';
		component.currentStage = 'onboard';

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

			expect(stages.indexOf(current))
				.toBeLessThan(stages.indexOf(next));
		});

		it('should move to an arbitrary stage', () => {
			const stageName = 'adopt';
			component.currentStage = 'adopt';
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
		const stageName = stages[stages.length - 1];
		component.zoomToStage(stageName);

		expect(component.current)
			.toEqual(stageName);

		component.zoomToNext(true);

		fixture.detectChanges();

		expect(component.current)
			.toEqual(stages[0]);
	});

	it('should go back if at the beginning', () => {
		const stageName = stages[0];

		component.zoomToStage(stageName);

		expect(component.current)
			.toEqual(stageName);

		component.zoomToPrevious(true);

		fixture.detectChanges();

		expect(component.current)
			.toEqual(stages[stages.length - 1]);
	});
});
