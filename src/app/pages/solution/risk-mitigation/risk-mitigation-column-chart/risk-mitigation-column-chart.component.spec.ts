import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMitigationColumnChartComponent } from './risk-mitigation-column-chart.component';
import { RiskMitigationColumnChartModule } from './risk-mitigation-column-chart.module';

describe('RiskMitigationColumnChartComponent', () => {
	let component: RiskMitigationColumnChartComponent;
	let fixture: ComponentFixture<RiskMitigationColumnChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RiskMitigationColumnChartModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RiskMitigationColumnChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
