import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsComponent } from './case-details.component';
import { CaseDetailsModule } from './case-details.module';

describe('CaseDetailsComponent', () => {
	let component: CaseDetailsComponent;
	let fixture: ComponentFixture<CaseDetailsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CaseDetailsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
