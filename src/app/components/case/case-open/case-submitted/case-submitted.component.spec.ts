import { Component } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import { By } from '@angular/platform-browser';

import { CuiModalService } from '@cisco-ngx/cui-components';
import { CaseSubmittedComponent } from './case-submitted.component';
import { CaseSubmittedModule } from './case-submitted.module';

/** Test Component for Routing */
@Component({
	template: 'Hello!',
})
class TestComponent { }

describe('CaseSubmittedComponent', () => {
	let component: CaseSubmittedComponent;
	let fixture: ComponentFixture<CaseSubmittedComponent>;
	let location: Location;
	let cuiModalService: CuiModalService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent],
			imports: [
				RouterTestingModule.withRoutes([{
					component: TestComponent,
					path: 'solution/resolution',
				}]),

				CaseSubmittedModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseSubmittedComponent);
		cuiModalService = TestBed.get(CuiModalService);
		location = TestBed.get(Location);
		component = fixture.componentInstance;
		component.caseData = {
			caseNum: '686350456',
			customerActivity: 'activity',
			description: 'Test Description',
			problemArea: 'area',
			requestRma: false,
			severity: 4,
			severityName: 'Ask a Question',
			subtech: '13',
			technology: '12',
			title: 'A Test Case',
		};
		component.asset = {
			serialNumber: '1234',
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should close', fakeAsync(() => {
		spyOn(cuiModalService, 'hide');
		const button = fixture.debugElement.query(By.css('[data-auto-id="CaseOpenDoneButton"]'));
		button.nativeElement.click();
		tick();
		expect(cuiModalService.hide)
			.toHaveBeenCalled();
	}));

	it('should navigate to case', fakeAsync(() => {
		const button = fixture.debugElement.query(By.css('[data-auto-id="CaseNumberButton"]'));
		button.nativeElement.click();
		tick();
		expect(location.path())
			.toEqual('/solution/resolution?case=686350456');
	}));
});