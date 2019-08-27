import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactSupportComponent } from './contact-support.component';
import { ContactSupportModule } from './contact-support.module';
import { EmailControllerService } from '@sdp-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProfileService } from '@cisco-ngx/cui-auth';
import { of } from 'rxjs';
import { UserResolve } from '@utilities';
import { user } from '@mock';

describe('ContactSupportComponent', () => {
	let component: ContactSupportComponent;
	let service: EmailControllerService;
	let fixture: ComponentFixture<ContactSupportComponent>;
	let userResolve: UserResolve;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ContactSupportModule,
				HttpClientTestingModule,
			],
			providers: [
				{
					provide: ProfileService,
					useValue: {
						getProfile () {
							return {
								cpr: {
									pf_auth_email: 'susan@company.com',
									pf_auth_firstname: 'Susan',
									pf_auth_lastname: 'Swanson',
									pf_auth_uid: 'susans',
								},
							};
						},
					},
				},
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		userResolve = TestBed.get(UserResolve);
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of(user.info.customerId));
		fixture = TestBed.createComponent(ContactSupportComponent);
		service = TestBed.get(EmailControllerService);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should have invalid form when empty', () => {
		expect(component.supportForm.valid)
			.toBeFalsy();
	});

	it('should send a email request', () => {
		spyOn(service, 'sendEmail')
			.and
			.returnValue(of(
				'Email Sent',
			));
		const title = component.supportForm.controls.title;
		expect(title.valid)
			.toBeFalsy();

		title.setValue('CX Portal Support');
		const description = component.supportForm.controls.description;
		expect(description.valid)
			.toBeFalsy();

		description.setValue('Test mail');
		fixture.detectChanges();
		component.submitMessage();
		expect(service.sendEmail)
			.toHaveBeenCalled();
	});

	it('should fetch list of portal support topics on init', () => {
		spyOn(component, 'getTopicList');
		component.ngOnInit();
		expect(component.getTopicList)
			.toHaveBeenCalled();
	});
});
