import {
	Component,
	ViewChild,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugeComponent } from './gauge.component';
import { GaugeModule } from './gauge.module';

/**
 * Wrapper component for unit testing ngOnInit
 */
@Component({
	template: `
	<app-gauge
	    #appGauge
		textColor="#243034"
		arcColor="#92dde4"
		[percentage]="percent"
		label="test">
	</app-gauge>
	`,
})
export class TestWrapperComponent {
	@ViewChild('appGauge', { static: false }) public appGauge;
	public percent = 0;
}

describe('GaugeComponent', () => {
	let component: GaugeComponent;
	let wrapperComponent: TestWrapperComponent;
	let fixture: ComponentFixture<GaugeComponent>;
	let wrapperFixture: ComponentFixture<TestWrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestWrapperComponent],
			imports: [GaugeModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GaugeComponent);
		component = fixture.componentInstance;
		wrapperFixture = TestBed.createComponent(TestWrapperComponent);
		wrapperComponent = wrapperFixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should update previous percentage', () => {
		wrapperFixture.detectChanges();
		expect(wrapperComponent.appGauge.previousPercentage)
			.toEqual(0);
		wrapperComponent.percent = 10;
		wrapperFixture.detectChanges();
		expect(wrapperComponent.appGauge.previousPercentage)
			.toEqual(0);
		wrapperComponent.percent = 20;
		wrapperFixture.detectChanges();
		expect(wrapperComponent.appGauge.previousPercentage)
				.toEqual(10);
	});
});
