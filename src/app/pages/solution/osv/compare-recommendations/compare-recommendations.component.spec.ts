import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareRecommendationsComponent } from './compare-recommendations.component';
import { CompareRecommendationsModule } from './compare-recommendations.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVScenarios } from '@mock';

describe('CompareRecommendationsComponent', () => {
	let component: CompareRecommendationsComponent;
	let fixture: ComponentFixture<CompareRecommendationsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CompareRecommendationsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
			.compileComponents();
	}));

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
		const recommendations = (<any>OSVScenarios[9].scenarios.GET[0].response.body)
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
		expect(component.calculateExposed({ a: 5, b: 10, c: 0 }))
			.toEqual(15);
		expect(component.calculateExposed({}))
			.toEqual(0);
	});

	it('should populate the bargraph series data', () => {
		const expectedOutput = [
			{ value: 5, label: 'H' },
			{ value: 0, lable: 'C' },
			{ value: 0, label: 'L' }
		];
		expect(component.populateBarGraphData({ High: 5 }).length)
			.toEqual(3);		
	});
});
