import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';

import { SoftwareGroupRecommendationsComponent } from './software-group-recommendations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SoftwareGroupRecommendationsModule } from './software-group-recommendations.module';
import { MicroMockModule } from '@cui-x-views/mock';
import { OSVScenarios } from '@mock';

describe('SoftwareGroupRecommendationsComponent', () => {
	let component: SoftwareGroupRecommendationsComponent;
	let fixture: ComponentFixture<SoftwareGroupRecommendationsComponent>;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupRecommendationsModule,
				HttpClientTestingModule,
				RouterTestingModule,
				MicroMockModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupRecommendationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should show compare recommendations on ngOnChanges', () => {
		const recommendations = (<any> OSVScenarios[9].scenarios.GET[0].response.body)
			.recommendations;
		component.ngOnChanges({
			recommendations: {
				currentValue: recommendations,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});
		fixture.detectChanges();
		expect(component.groupRecommendations)
			.toBeDefined();
		expect(component.groupRecommendations.length)
			.toEqual(2);
		expect(component.groupRecommendationsTable)
			.toBeDefined();
	});
});
