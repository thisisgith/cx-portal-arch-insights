import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LifecycleComponent } from './lifecycle.component';
import { LifecycleModule } from './lifecycle.module';
import { solutionATX, solutionRacetrack } from '@mock';
import { SolutionService } from '@services';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('LifecycleComponent', () => {
	let component: LifecycleComponent;
	let fixture: ComponentFixture<LifecycleComponent>;
	let de: DebugElement;
	let service: SolutionService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				RouterTestingModule,
				LifecycleModule,
			],
		})
		.compileComponents();

		service = TestBed.get(SolutionService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LifecycleComponent);
		component = fixture.componentInstance;

		spyOn(service, 'queryWebinars')
			.and
			.returnValue(of(solutionATX));

		spyOn(service, 'queryRacetrack')
			.and
			.returnValue(of(solutionRacetrack));

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
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
