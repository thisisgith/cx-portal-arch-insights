import { configureTestSuite } from 'ng-bullet';
import { fakeAsync, tick, ComponentFixture, TestBed, flush } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { CaseScenarios, HardwareScenarios, user } from '@mock';
import { CaseDetailsComponent } from './case-details.component';
import { CaseDetailsModule } from './case-details.module';
import { CaseService } from '@cui-x/services';
import { CaseDetailsService } from '@services';
import { InventoryService } from '@sdp-api';
import { ActivatedRoute } from '@angular/router';

fdescribe('CaseDetailsComponent', () => {
	let component: CaseDetailsComponent;
	let fixture: ComponentFixture<CaseDetailsComponent>;
	let caseService: CaseService;
	let caseDetailsService: CaseDetailsService;
	let inventoryService: InventoryService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseDetailsModule,
				HttpClientTestingModule,
			],
			providers: [
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		});
	});

	beforeEach(() => {
		caseService = TestBed.get(CaseService);
		caseDetailsService = TestBed.get(CaseDetailsService);
		inventoryService = TestBed.get(InventoryService);
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

	it('should call all of the required APIs for the selected case', fakeAsync(() => {
		component.case = { caseNumber: '680000001', deviceName: 'LA1-AP4800-1',  serialNumber: 'FOX1306GBAD' };
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		spyOn(caseService, 'fetchCaseNotes')
			.and
			.returnValue(of(CaseScenarios[1].scenarios.GET[0].response.body));
		spyOn(inventoryService, 'getHardware')
			.and
			.returnValue(of(HardwareScenarios[0].scenarios.GET[0].response.body));
		component.refresh();
		fixture.detectChanges();
		tick(2500); // Wait for all requests to finish
		expect(caseService.fetchCaseDetails)
			.toHaveBeenCalled();
		expect(caseService.fetchCaseNotes)
			.toHaveBeenCalled();
		expect(inventoryService.getHardware)
			.toHaveBeenCalled();
		// Close the fixture so the fromNow pipe stops
		fixture.destroy();
		flush();
	}));

	it('set number of files count to 0 if case details errors out', () => {
		const caseDetails = { result: { response: { getBrokerResponse: { error: '400' } } } };
		component.populateCaseFilesList(caseDetails);
		expect(component.numberOfFiles)
			.toEqual(0);
	});

	it('set number of files count from case details response', () => {
		const caseDetails = { result: { response: { getBrokerResponse: { downloadInfo: { noOfFiles: 4, fileDetail: [{}, {}, {}] } } } } };
		component.populateCaseFilesList(caseDetails);
		expect(component.numberOfFiles)
			.toEqual(3);
	});
});
