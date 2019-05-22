import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LifecycleComponent } from './lifecycle.component';
import { LifecycleModule } from './lifecycle.module';
import {
	solutionATX,
	solutionRacetrack,
	solutionEmptyRacetrack,
	updatePitstopAction,
 } from '@mock';
import { RacetrackService, RacetrackContentService } from '@cui-x/sdp-api';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('LifecycleComponent', () => {
	let component: LifecycleComponent;
	let fixture: ComponentFixture<LifecycleComponent>;
	let de: DebugElement;
	let el: HTMLElement;
	let racetrackService: RacetrackService;
	let racetrackContentService: RacetrackContentService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				RouterTestingModule,
				LifecycleModule,
			],
		})
		.compileComponents();

		racetrackService = TestBed.get(RacetrackService);
		racetrackContentService = TestBed.get(RacetrackContentService);
	}));

	describe('Racetrack', () => {

		beforeEach(() => {
			fixture = TestBed.createComponent(LifecycleComponent);
			component = fixture.componentInstance;

			spyOn(racetrackContentService, 'getRacetrackATX')
				.and
				.returnValue(of(solutionATX));

			spyOn(racetrackService, 'getRacetrack')
				.and
				.returnValue(of(solutionRacetrack));

			spyOn(racetrackService, 'updatePitstopAction')
				.and
				.returnValue(of(updatePitstopAction));

			fixture.detectChanges();
		});

		it('should create', () => {
			expect(component)
				.toBeTruthy();
		});

		describe('ATX', () => {
			it('should show atx items in the ATX card', () => {
				expect(component.atxResults.items.length)
					.toEqual(4);
				de = fixture.debugElement.query(By.css('#atxResults'));
				expect(de)
					.toBeTruthy();
			});

			it('should show webinar view-all modal', () => {
				component.showModal('webinars');
				fixture.detectChanges();

				de = fixture.debugElement.query(By.css('#webinarModal'));
				expect(de)
					.toBeTruthy();
			});
		});

		describe('PitstopActions', () => {

			it('should show 25% in the prograss label', () => {
				de = fixture.debugElement.query(By.css('#compActPct'));
				el = de.nativeElement;
				expect(el.innerText)
					.toEqual('25%');
			});

			it('should show action description when click action name', () => {
				component.selectAction(component.currentPitActionsWithStatus[1]);
				fixture.detectChanges();

				expect(component.currentPitActionsWithStatus[1].selected)
					.toBeTruthy();

				// click the same action again, will unselect the action
				component.selectAction(component.currentPitActionsWithStatus[1]);

				expect(component.currentPitActionsWithStatus[1].selected)
					.toBeFalsy();

				// since suggestedAction does not change, so will not trigger ATX API call
				expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalledTimes(1);
			});

			it('should call racetrackService API to update pitstopAction', () => {
				component.completeAction(component.currentPitActionsWithStatus[1]);
				fixture.detectChanges();

				expect(racetrackService.updatePitstopAction)
				.toHaveBeenCalled();

				expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalledTimes(2);

			});

			it('should refresh ATX if suggestedAction changes', () => {
				component.selectAction(component.currentPitActionsWithStatus[3]);
				fixture.detectChanges();

				expect(component.currentPitActionsWithStatus[3].selected)
					.toBeTruthy();

				expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalled();

			});

			it('should refresh ATX if suggestedAction changes', () => {
				component.completeAction(component.currentPitActionsWithStatus[2]);
				fixture.detectChanges();

				expect(racetrackService.updatePitstopAction)
				.toHaveBeenCalled();

				expect(racetrackContentService.getRacetrackATX)
				.toHaveBeenCalled();
			});
		});

		/**
		 * This currently has no working functionality, just testing the other branch of showModal()
		 */
		describe('coaching', () => {
			it('should show coaching modal', () => {
				component.showModal('coaching');
				fixture.detectChanges();

				de = fixture.debugElement.query(By.css('#coachingModal'));
				expect(de)
					.toBeTruthy();
			});
		});
	});

	describe('Racetrack with empty technologies', () => {
		beforeEach(() => {
			fixture = TestBed.createComponent(LifecycleComponent);
			component = fixture.componentInstance;

			spyOn(racetrackContentService, 'getRacetrackATX')
				.and
				.returnValue(of(solutionATX));

			spyOn(racetrackService, 'getRacetrack')
				.and
				.returnValue(of(solutionEmptyRacetrack));

			fixture.detectChanges();
		});

		it('should not show currentPitstop', () => {
			expect(component.currentPitstop)
				.toBeFalsy();
		});
	});
});
