import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GaugePanelModule } from './gauge-panel.module';
import { solutionRacetrack } from '@mock';
import { Component } from '@angular/core';
import { RacetrackResponseObject } from '@services';

describe('GaugePanelComponent', () => {
	/**
	 * Wrapper component to test gauge-panel
	 */
	@Component({
		selector: 'input-component',
		template: '<gauge-panel *ngIf="result" [options]="{racetrackData: result}"></gauge-panel>',
	})
	class TestHostComponent {
		public result: RacetrackResponseObject = solutionRacetrack;
	}

	let testHostComponent: TestHostComponent;
	let testHostFixture: ComponentFixture<TestHostComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestHostComponent],
			imports: [GaugePanelModule, RouterTestingModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		testHostFixture = TestBed.createComponent(TestHostComponent);
		testHostComponent = testHostFixture.componentInstance;
		testHostFixture.detectChanges();
	});

	it('should create', () => {
		expect(testHostComponent)
			.toBeTruthy();
	});
});
