import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AddNoteComponent } from './add-note.component';
import { AddNoteModule } from './add-note.module';
import { CaseService } from '@cui-x/services';

describe('AddNoteComponent', () => {
	let component: AddNoteComponent;
	let service: CaseService;
	let fixture: ComponentFixture<AddNoteComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AddNoteModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AddNoteComponent);
		service = TestBed.get(CaseService);
		component = fixture.componentInstance;
		component.case = {
			caseNumber: '123456789',
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should send a note create request', () => {
		spyOn(service, 'addCaseNote')
			.and
			.returnValue(of({
				status: 'SUCCESS',
			}));
		component.addCaseNote();
		expect(service.addCaseNote)
			.toHaveBeenCalled();
	});
});
