import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMitigationComponent } from './risk-mitigation.component';
import { RiskMitigationModule } from './risk-mitigation.module';

describe('RiskMitigationComponent', () => {
	let component: RiskMitigationComponent;
	let fixture: ComponentFixture<RiskMitigationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RiskMitigationModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RiskMitigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
