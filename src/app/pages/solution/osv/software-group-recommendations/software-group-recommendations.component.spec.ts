import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupRecommendationsComponent } from './software-group-recommendations.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SoftwareGroupRecommendationsComponent', () => {
	let component: SoftwareGroupRecommendationsComponent;
	let fixture: ComponentFixture<SoftwareGroupRecommendationsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupRecommendationsComponent,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupRecommendationsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
