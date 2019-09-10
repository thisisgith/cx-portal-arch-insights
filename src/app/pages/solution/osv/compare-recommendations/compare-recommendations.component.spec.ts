import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareRecommendationsComponent } from './compare-recommendations.component';
import { CompareRecommendationsModule } from './compare-recommendations.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVScenarios } from '@mock';
import { MicroMockModule } from '@cui-x-views/mock';
import { configureTestSuite } from 'ng-bullet';

describe('CompareRecommendationsComponent', () => {
	let component: CompareRecommendationsComponent;
	let fixture: ComponentFixture<CompareRecommendationsComponent>;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CompareRecommendationsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CompareRecommendationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should show compare recommendations on ngOnChanges', () => {
		const recommendations = (<any> OSVScenarios[9].scenarios.GET[0].response.body)
			.recommendationSummaries;
		component.ngOnChanges({
			recommendations: {
				currentValue: recommendations,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(component.machineRecommendations)
			.toBeDefined();
		expect(component.machineRecommendations.length)
			.toEqual(3);
		expect(component.currentRecommendation)
			.toBeDefined();
	});

	it('should emit onAction event on accept', () => {
		spyOn(component.onAction, 'emit');
		component.onAcceptClick('1.1');
		fixture.detectChanges();
		expect(component.onAction.emit)
			.toHaveBeenCalled();
		component.onCancelClick('1.1');
		expect(component.onAction.emit)
			.toHaveBeenCalledTimes(2);
	});

	it('should calculate the number of bugsExposed', () => {
		expect(component.calculateExposed({ H: 5, L: 10, M: 0 }))
			.toEqual(15);
		expect(component.calculateExposed({ }))
			.toEqual(0);
	});

	it('should populate the bargraph series data', () => {
		expect(component.populateBarGraphData({ H: 5 }).length)
			.toEqual(3);
	});
});
