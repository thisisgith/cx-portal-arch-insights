import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldNoticeDetailsComponent } from './field-notice-details.component';
import { FieldNoticeDetailsModule } from './field-notice-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductAlertsService } from '@sdp-api';
import { environment } from '@environment';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash-es';
import {
	user,
	MockFieldNoticeBulletins,
	MockFieldNoticeAdvisories,
	MockFieldNotices,
	Mock,
	RacetrackScenarios,
} from '@mock';
import { HttpErrorResponse } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { RacetrackInfoService } from '@services';

/**
 * Will fetch the currently active response body from the mock object
 * @param mock the mock object
 * @param type the scenario type
 * @returns the body response
 */
function getActiveBody (mock: Mock, type: string = 'GET') {
	const active = _.find(mock.scenarios[type], 'selected') || _.head(mock.scenarios[type]);

	return active.response.body;
}

describe('FieldNoticeDetailsComponent', () => {
	let component: FieldNoticeDetailsComponent;
	let fixture: ComponentFixture<FieldNoticeDetailsComponent>;
	let productAlertsService: ProductAlertsService;
	let racetrackInfoService: RacetrackInfoService;

	/**
	 * Sends our racetrack info
	 */
	const sendRacetrack = () => {
		racetrackInfoService.sendRacetrack(getActiveBody(RacetrackScenarios[0]));
		racetrackInfoService.sendCurrentSolution(
			getActiveBody(RacetrackScenarios[0]).solutions[0],
		);
		racetrackInfoService.sendCurrentTechnology(
			getActiveBody(RacetrackScenarios[0]).solutions[0].technologies[0],
		);
	};

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				FieldNoticeDetailsModule,
				HttpClientTestingModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(async(() => {
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		productAlertsService = TestBed.get(ProductAlertsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FieldNoticeDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing api calls', done => {
		component.advisory = MockFieldNoticeAdvisories[0];
		component.id = _.toString(MockFieldNoticeAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockFieldNoticeAdvisories[0],
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();
	});

	it('should fetch the advisory information given an advisory', done => {
		const mockAdvisories = _.filter(MockFieldNotices,
			{ fieldNoticeId: MockFieldNoticeAdvisories[0].id });

		component.advisory = MockFieldNoticeAdvisories[0];
		component.id = _.toString(MockFieldNoticeAdvisories[0].id);
		component.customerId = user.info.customerId;

		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of({ data: mockAdvisories }));

		const bulletins = _.filter(MockFieldNoticeBulletins,
			{ fieldNoticeId: MockFieldNoticeAdvisories[0].id });
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(of({ data: bulletins }));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockFieldNoticeAdvisories[0],
					assetIds: component.data.assetIds,
					bulletin: _.head(bulletins),
					notice: _.head(mockAdvisories),
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();
	});

	it('should handle changing advisories', () => {
		component.advisory = MockFieldNoticeAdvisories[0];
		component.id = _.toString(MockFieldNoticeAdvisories[0].id);
		component.customerId = user.info.customerId;

		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		sendRacetrack();
		fixture.detectChanges();

		expect(component.data.advisory)
			.toEqual(MockFieldNoticeAdvisories[0]);

		component.advisory = MockFieldNoticeAdvisories[1];
		component.id = _.toString(MockFieldNoticeAdvisories[1].id);
		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(MockFieldNoticeAdvisories[1].id),
			},
		});

		fixture.detectChanges();
		expect(component.data.advisory)
			.toEqual(MockFieldNoticeAdvisories[1]);
	});
});
