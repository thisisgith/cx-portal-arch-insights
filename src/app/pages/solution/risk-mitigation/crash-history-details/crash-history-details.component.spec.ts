import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashHistoryDetailsComponent } from './crash-history-details.component';
import { RiskMitigationService } from '@sdp-api';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { CrashHistoryDetailsModule } from './crash-history-details.module';
import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { user, RiskScenarios } from '@mock';
import { SimpleChange, SimpleChanges } from '@angular/core';

fdescribe('CrashHistoryDetailsComponent', () => {
	let component: CrashHistoryDetailsComponent;
	let fixture: ComponentFixture<CrashHistoryDetailsComponent>;
	let riskMitigationService: RiskMitigationService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CrashHistoryDetailsModule,
				HttpClientTestingModule,
				MicroMockModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
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

	beforeEach(async(() => {
		riskMitigationService = TestBed.get(RiskMitigationService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CrashHistoryDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it('Should get history of crashed device', done => {
		const fakeInput: SimpleChanges = {
			selectedSystem: new SimpleChange(null, {
				neInstanceId: 'TestID',
				productId: 'TestProdID',
			}, false),
		};
		spyOn(riskMitigationService, 'getCrashHistoryForDevice')
			.and
			.returnValue(of(RiskScenarios[3].scenarios.GET[0].response.body));
		component.ngOnChanges(fakeInput);
		fixture.whenStable()
			.then(() => {
				fixture.detectChanges();
				expect(component.crashHistoryGridDetails.tableData)
					.toBeDefined();
				done();
			});
	});

	it('should unset the selected System', () => {
		component.onPanelClose();
		expect(component.selectedSystem)
			.toBeFalsy();
		expect(component.showAssetDetailsView)
			.toBeFalsy();
	});

	it('should handle on panel hidden', () => {
		const panelCloseSpy = spyOn(component, 'onAllPanelsClose');

		component.handleHidden();
		expect(panelCloseSpy)
			.toHaveBeenCalled();
	});
});
