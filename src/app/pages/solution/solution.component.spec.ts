import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';
import { solutionATX } from '@mock';
import { SolutionService } from '@services';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('SolutionComponent', () => {
	let component: SolutionComponent;
	let fixture: ComponentFixture<SolutionComponent>;
	let de: DebugElement;
	let service: SolutionService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				RouterTestingModule,
				SolutionModule,
			],
		})
		.compileComponents();

		service = TestBed.get(SolutionService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SolutionComponent);
		component = fixture.componentInstance;

		spyOn(service, 'queryWebinars')
			.and
			.returnValue(of(solutionATX));

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should show the support help tab by default', () => {
		expect(component.showSupportTab)
			.toBeTruthy();

		expect(component.showProductTab)
			.toBeFalsy();

		de = fixture.debugElement.query(By.css('#supportTab'));
		expect(de)
			.toBeTruthy();
	});

	it('should show the product tab', () => {
		component.toggleProductTab();
		expect(component.showProductTab)
			.toBeTruthy();
		expect(component.showSupportTab)
			.toBeFalsy();

		fixture.detectChanges();
		de = fixture.debugElement.query(By.css('#productTab'));
		expect(de)
			.toBeTruthy();
	});

	describe('webinars', () => {
		it('should show webinars in the webinar card', () => {
			expect(component.webinarResults.webinars.length)
				.toEqual(6);
			de = fixture.debugElement.query(By.css('#webinarResults'));
			expect(de)
				.toBeTruthy();
		});

		it('should show webinar view-all modal', () => {
			component.showModal('webinars');
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#webinarModal'));
			expect(de)
				.toBeTruthy();
		});
	});

	/**
	 * This currently has no working functionality, just testing the other branch of showModal()
	 */
	describe('coaching', () => {
		it('should show coaching modal', () => {
			component.showModal('coaching');
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#coachingModal'));
			expect(de)
				.toBeTruthy();
		});
	});
});
