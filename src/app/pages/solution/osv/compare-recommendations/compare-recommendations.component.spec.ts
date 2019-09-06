import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareRecommendationsComponent } from './compare-recommendations.component';
import { CompareRecommendationsModule } from './compare-recommendations.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OSVScenarios } from '@mock';

fdescribe('CompareRecommendationsComponent', () => {
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
		component.ngOnChanges({
			recommendations: {
				currentValue: OSVScenarios[9].scenarios.GET[0].response.body,
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
});
