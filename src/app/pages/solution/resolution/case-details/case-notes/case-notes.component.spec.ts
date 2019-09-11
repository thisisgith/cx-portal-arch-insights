import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNotesComponent } from './case-notes.component';
import { CaseNotesModule } from './case-notes.module';

describe('CaseNotesComponent', () => {
	let component: CaseNotesComponent;
	let fixture: ComponentFixture<CaseNotesComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CaseNotesModule],
		});
	});

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

	it('should get sorted notes on init', () => {
		spyOn(component, 'getSortedNotes');
		component.ngOnInit();
		expect(component.getSortedNotes)
			.toHaveBeenCalled();
	});
});
