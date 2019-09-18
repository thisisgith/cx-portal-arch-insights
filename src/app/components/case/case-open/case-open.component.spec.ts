import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormGroup } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CaseScenarios, MockNetworkElements, MockAssetsData, user } from '@mock';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { CloseConfirmComponent } from './close-confirm/close-confirm.component';
import { CaseOpenComponent } from './case-open.component';
import { CaseOpenModule } from './case-open.module';
import { CaseService } from '@cui-x/services';
import { RouterTestingModule } from '@angular/router/testing';
import { UserResolve } from '@utilities';

describe('CaseOpenComponent', () => {
	let component: CaseOpenComponent;
	let fixture: ComponentFixture<CaseOpenComponent>;
	let cuiModalService: CuiModalService;
	let caseService: CaseService;
	let userResolve: UserResolve;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseOpenModule,
				HttpClientTestingModule,
				RouterTestingModule,
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
		userResolve = TestBed.get(UserResolve);
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of(user.info.customerId));

		fixture = TestBed.createComponent(CaseOpenComponent);
		cuiModalService = TestBed.get(CuiModalService);
		caseService = TestBed.get(CaseService);
		component = fixture.componentInstance;
		component.data = {
			asset: MockAssetsData[0],
			element: MockNetworkElements[0],
		};
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
		(<FormGroup> component.caseForm.controls.techInfo).controls.problemArea.setValue({
			customerActivity: 'Operate',
			problemCode: 'PASSWORD_RECOV',
			problemCodeName: 'Password Recovery',
		});
		component.caseForm.controls.severity.setValue(3);
		component.caseForm.controls.requestRma.setValue(false);
		(<FormGroup> component.caseForm.controls.techInfo).controls.technology.setValue('10');
		(<FormGroup> component.caseForm.controls.techInfo).controls.subtech.setValue('33');
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
