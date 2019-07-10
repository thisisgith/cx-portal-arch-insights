import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSummaryComponent } from './case-summary.component';
import { CaseSummaryModule } from './case-summary.module';

describe('CaseSummaryComponent', () => {
	let component: CaseSummaryComponent;
	let fixture: ComponentFixture<CaseSummaryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CaseSummaryModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
