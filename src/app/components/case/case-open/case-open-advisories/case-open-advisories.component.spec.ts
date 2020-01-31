import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ProfileService } from '@cisco-ngx/cui-auth';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { CaseService } from '@cui-x/services';

import { CaseScenarios } from '@mock';
import { CaseOpenAdvisoriesComponent } from './case-open-advisories.component';
import { CaseOpenAdvisoriesModule } from './case-open-advisories.module';
import { CloseConfirmComponent } from '../close-confirm/close-confirm.component';

describe('CaseOpenAdvisoriesComponent', () => {
	let component: CaseOpenAdvisoriesComponent;
	let fixture: ComponentFixture<CaseOpenAdvisoriesComponent>;
	let caseService: CaseService;
	let cuiModalService: CuiModalService;

	const setData = (type: string) => {
		if (type === 'security') {
			component.data = {
				advisory: {
					bulletinTitle: 'Test Security Advisory',
				},
				selectedAsset: { serialNumber: 'FDXYZ' },
				type: 'security',
			};
		} else if (type === 'bug') {
			component.data = {
				advisory: {
					title: 'Test Bug',
				},
				selectedAsset: { serialNumber: 'FDXYZ' },
				type: 'bug',
			};
		}
		fixture.detectChanges();
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseOpenAdvisoriesModule,
				HttpClientTestingModule,
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
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseOpenAdvisoriesComponent);
		caseService = TestBed.get(CaseService);
		cuiModalService = TestBed.get(CuiModalService);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		setData('security');
		expect(component)
			.toBeTruthy();
	});

	it('should set title to bulletinTitle', () => {
		setData('security');
		expect(component.caseForm.controls.title.value)
			.toEqual('Test Security Advisory');
	});

	it('should set title to title for bug', () => {
		setData('bug');
		expect(component.caseForm.controls.title.value)
			.toEqual('Test Bug');
	});

	it('should prompt the user if they want to close', fakeAsync(() => {
		setData('security');
		jest.spyOn(cuiModalService, 'showComponent');
		const button = fixture.debugElement.query(By.css('a[data-auto-id="CaseOpenClose"]'));
		button.nativeElement.click();
		tick();
		expect(cuiModalService.showComponent)
			.toHaveBeenCalledWith(CloseConfirmComponent, { });
	}));

	it('should submit', fakeAsync(() => {
		setData('security');
		jest.spyOn(caseService, 'createCase')
			.mockReturnValue(of(CaseScenarios[9].scenarios.POST[0].response.body));
		component.caseForm.controls.description.setValue('a');
		component.caseForm.controls.title.setValue('a');
		(<FormGroup> component.caseForm.controls.techInfo).controls.technology.setValue('10');
		(<FormGroup> component.caseForm.controls.techInfo).controls.subtech.setValue('11');
		(<FormGroup> component.caseForm.controls.techInfo).controls.problemArea.setValue({
			customerActivity: 'Operate',
			problemCode: 'PASSWORD_RECOV',
			problemCodeName: 'Password Recovery',
		});
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
