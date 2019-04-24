import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';
import { mockData } from './solution.component.spec.mock';
import { SolutionService } from './solution.service';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SolutionComponent', () => {
	let component: SolutionComponent;
	let fixture: ComponentFixture<SolutionComponent>;
	let de: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AppModule,
				RouterTestingModule,
				SolutionModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SolutionComponent);
		component = fixture.componentInstance;
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
		it('should show webinars in the webinar card',
			inject([SolutionService], (service: SolutionService) => {
				spyOn(service, 'queryWebinars')
					.and
					.returnValue(of(mockData));

				component.getWebinars();

				fixture.detectChanges();
				expect(service.queryWebinars)
					.toHaveBeenCalled();
				expect(component.webinarResults.webinars.length)
					.toEqual(6);
				de = fixture.debugElement.query(By.css('#webinarResults'));
				expect(de)
					.toBeTruthy();
			}));

		it('should show webinar view-all modal',
			inject([SolutionService], (service: SolutionService) => {
				spyOn(service, 'queryWebinars')
					.and
					.returnValue(of(mockData));

				component.getWebinars();
				fixture.detectChanges();
				component.showModal('webinars');
				fixture.detectChanges();

				de = fixture.debugElement.query(By.css('#webinarModal'));
				expect(de)
					.toBeTruthy();
			}));
	});

	/**
	 * This currently has no working functionality, just testing the other branch of showModal()
	 */
	describe('coaching', () => {
		it('should show coaching modal',
			inject([SolutionService], (service: SolutionService) => {
				spyOn(service, 'queryWebinars')
					.and
					.returnValue(of(mockData));

				component.getWebinars();
				fixture.detectChanges();
				component.showModal('coaching');
				fixture.detectChanges();

				de = fixture.debugElement.query(By.css('#coachingModal'));
				expect(de)
					.toBeTruthy();
			}));

	});
});
