import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ReachabilityChartComponent } from './reachability-chart.component';
import { ReachabilityChartModule } from './reachability-chart.module';

describe('ReachabilityChartComponent', () => {
	let component: ReachabilityChartComponent;
	let fixture: ComponentFixture<ReachabilityChartComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ReachabilityChartModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ReachabilityChartComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
		component.ngOnDestroy();
	});
});
