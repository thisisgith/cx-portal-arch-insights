import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsBarChartComponent } from './assets-bar-chart.component';
import { AssetsBarChartModule } from './assets-bar-chart.module';

describe('AssetsBarChartComponent', () => {
	let component: AssetsBarChartComponent;
	let fixture: ComponentFixture<AssetsBarChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AssetsBarChartModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsBarChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
