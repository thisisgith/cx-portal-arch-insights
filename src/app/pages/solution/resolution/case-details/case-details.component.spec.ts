import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CaseDetailsComponent } from './case-details.component';
import { CaseDetailsModule } from './case-details.module';
import { CaseService } from '@cui-x/services';
import { CaseDetailsService } from '@services';

describe('CaseDetailsComponent', () => {
	let component: CaseDetailsComponent;
	let fixture: ComponentFixture<CaseDetailsComponent>;
	let caseService: CaseService;
	let caseDetailsService: CaseDetailsService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseDetailsModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		caseService = TestBed.get(CaseService);
		caseDetailsService = TestBed.get(CaseDetailsService);
		fixture = TestBed.createComponent(CaseDetailsComponent);
		component = fixture.componentInstance;
		component.case = {
			caseNumber: '1234',
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh notes when one is added', fakeAsync(() => {
		spyOn(caseService, 'fetchCaseNotes')
			.and
			.returnValue(of([]));
		caseDetailsService.refreshNotesList(true);
		tick();
		expect(caseService.fetchCaseNotes)
			.toHaveBeenCalled();
	}));

	it('shouldn\'t refresh if no case is selected', () => {
		spyOn(caseService, 'fetchCaseDetails');
		component.case = null;
		fixture.detectChanges();
		component.ngOnChanges({ });
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalledTimes(0);
	});

	it('should emit case serial number to open asset 360 view', () => {
		const caseDetailsObj = {
			bugId: '',
			caseAccepted: false,
			caseNumber: 'CS112345',
			caseOrigin: 'Phone',
			caseOwner: '',
			caseType: 'TAC',
			ccsUUId: 'jkipp@cisco.com',
			childContainerId: '111731',
			ciUUId: 'd2348285-e427-4720-8647-364a28eb9f32',
			closedDate: '',
			contactEmail: 'jkipp@cisco.com',
			contactFirstName: 'Joseph',
			contactId: 'jkipp',
			contactLastName: 'Kipping',
			contactPhone: '+14692551107',
			containerType: 'S',
			contractNumber: '912512343',
			country: '',
			createdDate: '22 Apr 2019 07:50 AM PST',
			customerTicketNumber: '',
			deviceName: 'SWTG-9404',
			discussionThreadId: '',
			hwProductId: '',
			hwProductName: '',
			initialPriority: '1',
			jbrUUId: 'U6WPE6ZW1NHJY47A25CLTX2X2O',
			kacUUId: '',
			lastModifiedDate: '2019-06-03T16:41:00.000Z',
			owner: 'Test User',
			parentContainerId: '109185',
			partnerCaseOwnerName: '',
			picaId: '',
			priority: '3',
			problemCode: 'ERROR_MESSAGES',
			problemDescription: 'Test CIN Proxy Employee Subscription',
			rmaCreatedDate: '',
			rmaNumber: '88346234, 88346235, 800000000',
			serialNumber: 'FOC1544Y16T',
			softwareVersion: 'abcd',
			spokenLanguage: 'US',
			status: 'Customer Updated',
			statusType: 'O',
			subscriptionRefId: 'Sub2146937',
			subTechnologyId: 801,
			subTechnologyName: 'WCCP (Web Cache Control Protocol)',
			summary: 'Test CIN Proxy Employee Subscription - testing case update.',
			swProductId: '',
			swProductName: '',
			technologyId: 14,
			technologyName: 'Application Networking Services',
		};
		component.caseDetails = caseDetailsObj;
		spyOn(component.showAssetDetails, 'emit');
		component.showAssetDetailsView();
		expect(component.showAssetDetails.emit)
			.toHaveBeenCalled();
	});

});
