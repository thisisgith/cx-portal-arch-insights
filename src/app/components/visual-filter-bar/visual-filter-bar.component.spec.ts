import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualFilterBarComponent } from './visual-filter-bar.component';

describe('VisualFilterBarComponent', () => {
	let component: VisualFilterBarComponent;
	let fixture: ComponentFixture<VisualFilterBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [VisualFilterBarComponent],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(VisualFilterBarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});
});
