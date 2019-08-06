import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectInstructionsComponent } from './select-instructions.component';
import { SelectInstructionsModule } from './select-instructions.module';
import { RouterTestingModule } from '@angular/router/testing';
import { environment } from '../../../../environments/environment';
import { Selection } from '../setup-ie.types';

describe('SelectInstructionsComponent', () => {
	let component: SelectInstructionsComponent;
	let fixture: ComponentFixture<SelectInstructionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				SelectInstructionsModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectInstructionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should select', () => {
		const sub = component.onStepComplete
			.subscribe(() => {
				expect()
					.nothing();
				sub.unsubscribe();
			});
		component.onSelect(Selection.VBOX);
	});
});
