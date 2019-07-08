import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHeaderComponent } from './details-header.component';
import { DetailsHeaderModule } from './details-header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DetailsHeaderComponent', () => {
	let component: DetailsHeaderComponent;
	let fixture: ComponentFixture<DetailsHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				DetailsHeaderModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailsHeaderComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should not have active class if actions dropdown is not active', () => {
		component.actionDropdownActive = false;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.dropdown--actions');

		expect(button)
			.not
			.toHaveClass('active');
	});

	it('should have active class to cases dropddown if active', () => {
		component.casesDropdownActive = true;
		component.componentData.openCases = 1;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.open-case-toggle-btn');

		expect(button)
			.toHaveClass('active');
	});

	it('should not add active class to cases dropddown if not active', () => {
		component.casesDropdownActive = false;
		component.componentData.openCases = 1;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.open-case-toggle-btn');

		expect(button)
			.not
			.toHaveClass('active');
	});

	it('should have active class if actions dropdown is active', () => {
		component.actionDropdownActive = true;

		fixture.detectChanges();

		const button = fixture.debugElement.nativeElement.querySelector('.dropdown--actions');

		expect(button)
			.toHaveClass('active');
	});

});
