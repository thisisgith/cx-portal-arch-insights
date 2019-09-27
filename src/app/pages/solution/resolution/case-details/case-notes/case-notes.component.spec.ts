import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CaseNotesComponent } from './case-notes.component';
import { CaseNotesModule } from './case-notes.module';
import { ProfileService } from '@cisco-ngx/cui-auth';

describe('CaseNotesComponent', () => {
	let component: CaseNotesComponent;
	let fixture: ComponentFixture<CaseNotesComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CaseNotesModule],
			providers: [
				{
					provide: ProfileService,
					useValue: {
						getProfile () {
							return { cpr: { pf_auth_uid: 'swtg.test.0' } };
						},
					},
				},
			],
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

	it('sort notes based on created date', () => {
		component.caseNotes = [
			{
				createdDate: '20 Jun 2019 01:16 PM EST',
				createdByID : 'swtg.test.0',
				a: 0,
			},
			{
				createdDate: '21 Jun 2019 01:16 PM EST',
				createdByID : 'svorma1',
				a: 1,
			},
		];
		component.getSortedNotes();
		expect(component.caseNotes[0].a)
			.toEqual(1);
		expect(component.caseNotes[1].a)
			.toEqual(0);
	});
});
