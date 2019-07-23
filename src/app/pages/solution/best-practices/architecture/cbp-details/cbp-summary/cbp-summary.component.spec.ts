import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpSummaryComponent } from './cbp-summary.component';
import { CbpSummaryModule } from './cbp-summary.module';

describe('CbpSummaryComponent', () => {
	let component: CbpSummaryComponent;
	let fixture: ComponentFixture<CbpSummaryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpSummaryModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
