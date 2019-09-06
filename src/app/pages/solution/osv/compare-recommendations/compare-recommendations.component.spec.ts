import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareRecommendationsComponent } from './compare-recommendations.component';
import { CompareRecommendationsModule } from './compare-recommendations.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

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
});
