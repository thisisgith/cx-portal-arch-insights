import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSelectOptionComponent } from './panel-select-option.component';

describe('PanelSelectOptionComponent', () => {
	let component: PanelSelectOptionComponent<any>;
	let fixture: ComponentFixture<PanelSelectOptionComponent<any>>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [PanelSelectOptionComponent],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(PanelSelectOptionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
