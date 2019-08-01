import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureBarChartComponent } from './architecture-bar-chart.component';
import { ArchitectureBarChartModule } from './architecture-bar-chart.module';

describe('ArchitectureBarChartComponent', () => {
	let component: ArchitectureBarChartComponent;
	let fixture: ComponentFixture<ArchitectureBarChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ArchitectureBarChartModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ArchitectureBarChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
