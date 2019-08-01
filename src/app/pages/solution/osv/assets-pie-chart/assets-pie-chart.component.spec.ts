import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsPieChartComponent } from './assets-pie-chart.component';
import { AssetsPieChartModule } from './assets-pie-chart.module';

describe('AssetsPieChartComponent', () => {
	let component: AssetsPieChartComponent;
	let fixture: ComponentFixture<AssetsPieChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AssetsPieChartModule],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsPieChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
