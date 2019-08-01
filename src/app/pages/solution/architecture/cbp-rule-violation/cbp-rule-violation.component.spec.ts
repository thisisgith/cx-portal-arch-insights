import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CbpRuleViolationModule } from './cbp-rule-violation.module';

describe('CbpRuleViolationComponent', () => {
	let component: CbpRuleViolationComponent;
	let fixture: ComponentFixture<CbpRuleViolationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpRuleViolationModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpRuleViolationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
