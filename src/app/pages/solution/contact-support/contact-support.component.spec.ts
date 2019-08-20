import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContactSupportComponent } from './contact-support.component';
import { ContactSupportModule } from './contact-support.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';

describe('ContactSupportComponent', () => {
	let component: ContactSupportComponent;
	let fixture: ComponentFixture<ContactSupportComponent>;
	let osvService: OSVService;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ContactSupportModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ContactSupportComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should turn off loading indicator once we send support email', () => {
		spyOn(osvService, 'contactSupport')
			.and
			.returnValue(of({ status: true, message: 'test message', messageDetails: '' }));
		component.submitSupportTopic('topictest', 'some dummy data');
		fixture.detectChanges();
		expect(component.emailStatus)
		.toBe(true);
		expect(component.modelHeading)
		.toEqual('test message');
		expect(component.showLoader)
			.toBe(false);
	});
});
