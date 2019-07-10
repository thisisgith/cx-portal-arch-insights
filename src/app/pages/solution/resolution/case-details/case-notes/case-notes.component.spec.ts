import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNotesComponent } from './case-notes.component';
import { CaseNotesModule } from './case-notes.module';

describe('CaseNotesComponent', () => {
	let component: CaseNotesComponent;
	let fixture: ComponentFixture<CaseNotesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CaseNotesModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseNotesComponent);
		component = fixture.componentInstance;
		component.caseNotes = [];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
