import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CaseDetailsComponent } from './case-details.component';
import { CaseDetailsModule } from './case-details.module';
import { CaseService } from '@cui-x/services';
import { CaseDetailsService } from '@services';

describe('CaseDetailsComponent', () => {
	let component: CaseDetailsComponent;
	let fixture: ComponentFixture<CaseDetailsComponent>;
	let caseService: CaseService;
	let caseDetailsService: CaseDetailsService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseDetailsModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		caseService = TestBed.get(CaseService);
		caseDetailsService = TestBed.get(CaseDetailsService);
		fixture = TestBed.createComponent(CaseDetailsComponent);
		component = fixture.componentInstance;
		component.case = {
			caseNumber: '1234',
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh notes when one is added', fakeAsync(() => {
		spyOn(caseService, 'fetchCaseNotes')
			.and
			.returnValue(of([]));
		caseDetailsService.refreshNotesList(true);
		tick();
		expect(caseService.fetchCaseNotes)
			.toHaveBeenCalled();
	}));

	it('shouldn\'t refresh if no case is selected', () => {
		spyOn(caseService, 'fetchCaseDetails');
		component.case = null;
		fixture.detectChanges();
		component.ngOnChanges({ });
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalledTimes(0);
	});
});
