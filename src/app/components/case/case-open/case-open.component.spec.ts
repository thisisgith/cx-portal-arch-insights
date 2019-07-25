import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { CaseScenarios } from '@mock';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { CaseRequestType } from '@classes';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { CloseConfirmComponent } from './close-confirm/close-confirm.component';
import { CaseOpenComponent } from './case-open.component';
import { CaseOpenModule } from './case-open.module';
import { CaseService } from '@cui-x/services';

describe('CaseOpenComponent', () => {
	let component: CaseOpenComponent;
	let fixture: ComponentFixture<CaseOpenComponent>;
	let cuiModalService: CuiModalService;
	let caseService: CaseService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,

				CaseOpenModule,
			],
			providers: [
				{
					provide: ProfileService,
					useValue: {
						getProfile () {
							return { cpr: { pf_auth_uid: 'swtg.test.0' } };
						},
					},
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseOpenComponent);
		cuiModalService = TestBed.get(CuiModalService);
		caseService = TestBed.get(CaseService);
		component = fixture.componentInstance;
		component.data = { asset: { serialNumber: 'FDXYZ' } };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should prompt the user if they want to close', fakeAsync(() => {
		spyOn(cuiModalService, 'showComponent');
		const button = fixture.debugElement.query(By.css('a[data-auto-id="CaseOpenClose"]'));
		button.nativeElement.click();
		tick();
		expect(cuiModalService.showComponent)
			.toHaveBeenCalledWith(CloseConfirmComponent, { });
	}));

	it('should refresh problemArea options on RMA change', fakeAsync(() => {
		spyOn(caseService, 'fetchProblemArea')
			.and
			.returnValue(
				of(null),
			);
		component.caseForm.controls.requestRma.setValue(true);
		tick();
		expect(caseService.fetchProblemArea)
			.toHaveBeenCalledWith(CaseRequestType.RMA);
	}));

	it('should expand', fakeAsync(() => {
		component.caseForm.controls.description.setValue('a');
		component.caseForm.controls.title.setValue('a');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="CaseOpenNextButton"]'),
		);
		button.nativeElement.click();
		tick();
		expect(component.expand)
			.toBeTruthy();
	}));

	it('should submit', fakeAsync(() => {
		spyOn(caseService, 'createCase')
			.and
			.returnValue(of(CaseScenarios[9].scenarios.POST[0].response.body));
		component.caseForm.controls.description.setValue('a');
		component.caseForm.controls.title.setValue('a');
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="CaseOpenNextButton"]'),
		);
		button.nativeElement.click();
		tick();
		fixture.detectChanges(); // click next and expand
		component.caseForm.controls.problemArea.setValue({
			customerActivity: 'Operate',
			problemCode: 'PASSWORD_RECOV',
			problemCodeName: 'Password Recovery',
		});
		component.caseForm.controls.severity.setValue(3);
		component.caseForm.controls.requestRma.setValue(false);
		component.caseForm.controls.technology.setValue('10');
		fixture.detectChanges(); // enable submit button
		const submitButton = fixture.debugElement.query(
			By.css('[data-auto-id="CaseOpenSubmitButton"]'),
		);
		submitButton.nativeElement.click();
		tick();
		expect(caseService.createCase)
			.toHaveBeenCalled();
	}));
});
