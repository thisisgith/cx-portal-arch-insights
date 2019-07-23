import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoriesBarChartComponent } from './advisories-bar-chart.component';
import { AdvisoriesBarChartModule } from './advisories-bar-chart.module';

describe('AdvisoriesBarChartComponent', () => {
	let component: AdvisoriesBarChartComponent;
	let fixture: ComponentFixture<AdvisoriesBarChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AdvisoriesBarChartModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdvisoriesBarChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
