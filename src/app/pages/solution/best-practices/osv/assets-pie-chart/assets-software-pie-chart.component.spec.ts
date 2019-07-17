import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsSoftwarePieChartComponent } from './assets-software-pie-chart.component';
import { AssetsSoftwarePieChartModule } from './assets-software-pie-chart.module';

describe('AssetsSoftwarePieChartComponent', () => {
	let component: AssetsSoftwarePieChartComponent;
	let fixture: ComponentFixture<AssetsSoftwarePieChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AssetsSoftwarePieChartModule],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsSoftwarePieChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
