import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AddNoteComponent } from './add-note.component';
import { AddNoteModule } from './add-note.module';

describe('AddNoteComponent', () => {
	let component: AddNoteComponent;
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
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
