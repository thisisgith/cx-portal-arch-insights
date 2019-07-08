import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAdvisoriesComponent } from './details-advisories.component';
import { DetailsAdvisoriesModule } from './details-advisories.module';

describe('DetailsAdvisoriesComponent', () => {
	let component: DetailsAdvisoriesComponent;
	let fixture: ComponentFixture<DetailsAdvisoriesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DetailsAdvisoriesModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailsAdvisoriesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
