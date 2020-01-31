import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
	AdvisorySecurityAdvisoryScenarios,
	FieldNoticeAdvisoryScenarios,
	Mock,
	CriticalBugData,
} from '@mock';
import { AdvisoryDetailsComponent } from './advisory-details.component';
import { AdvisoryDetailsModule } from './advisory-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import * as _ from 'lodash-es';
import { SecurityAdvisoryInfo, FieldNoticeAdvisory } from '@sdp-api';
import { DetailsPanelStackService } from '@services';

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

describe('AdvisoryDetailsComponent', () => {
	let component: AdvisoryDetailsComponent;
	let fixture: ComponentFixture<AdvisoryDetailsComponent>;

	let detailsPanelStackService: DetailsPanelStackService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AdvisoryDetailsModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		detailsPanelStackService = TestBed.get(DetailsPanelStackService);
		fixture = TestBed.createComponent(AdvisoryDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should load a security advisory', fakeAsync(() => {
		const advisory: SecurityAdvisoryInfo =
			getActiveBody(AdvisorySecurityAdvisoryScenarios[0]).data[0];
		const nextAdvisory: SecurityAdvisoryInfo =
		getActiveBody(AdvisorySecurityAdvisoryScenarios[0]).data[1];

		component.advisory = advisory;
		component.advisoryId = _.toString(advisory.id);
		component.type = 'security';

		component.ngOnChanges({
			advisory: {
				currentValue: advisory,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
			advisoryId: {
				currentValue: _.toString(advisory.id),
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		tick();

		component.advisory = nextAdvisory;
		component.advisoryId = _.toString(nextAdvisory.id);

		component.ngOnChanges({
			advisory: {
				currentValue: nextAdvisory,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: advisory,
			},
			advisoryId: {
				currentValue: _.toString(nextAdvisory.id),
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(advisory.id),
			},
		});

		expect(component.advisoryId)
			.toEqual(_.toString(nextAdvisory.id));

		expect(component.title)
			.toContain('Security');
	}));

	it('should load a bug', fakeAsync(() => {
		const advisory = CriticalBugData[0];
		const nextAdvisory = CriticalBugData[1];

		component.advisory = advisory;
		component.advisoryId = _.toString(advisory.id);
		component.type = 'bug';

		component.ngOnChanges({
			advisory: {
				currentValue: advisory,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
			advisoryId: {
				currentValue: _.toString(advisory.id),
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		tick();

		component.advisory = nextAdvisory;
		component.advisoryId = _.toString(nextAdvisory.id);

		component.ngOnChanges({
			advisory: {
				currentValue: nextAdvisory,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: advisory,
			},
			advisoryId: {
				currentValue: _.toString(nextAdvisory.id),
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(advisory.id),
			},
		});

		expect(component.advisoryId)
			.toEqual(_.toString(nextAdvisory.id));

		expect(component.title)
			.toEqual(`Bug ${nextAdvisory.id}`);
	}));

	it('should load a field notice', fakeAsync(() => {
		const advisory: FieldNoticeAdvisory =
			getActiveBody(FieldNoticeAdvisoryScenarios[0]).data[0];
		const nextAdvisory: FieldNoticeAdvisory =
			getActiveBody(FieldNoticeAdvisoryScenarios[0]).data[1];

		component.advisory = advisory;
		component.advisoryId = _.toString(advisory.id);
		component.type = 'field';

		component.ngOnChanges({
			advisory: {
				currentValue: advisory,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
			advisoryId: {
				currentValue: _.toString(advisory.id),
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		tick();

		component.advisory = nextAdvisory;
		component.advisoryId = _.toString(nextAdvisory.id);

		component.ngOnChanges({
			advisory: {
				currentValue: nextAdvisory,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: advisory,
			},
			advisoryId: {
				currentValue: _.toString(nextAdvisory.id),
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(advisory.id),
			},
		});

		expect(component.advisoryId)
			.toEqual(_.toString(nextAdvisory.id));

		expect(component.title)
			.toContain(`FN ${nextAdvisory.id}`);
	}));

	it('should handle passing without an id', fakeAsync(() => {
		const advisory: FieldNoticeAdvisory =
			getActiveBody(FieldNoticeAdvisoryScenarios[0]).data[0];

		component.advisory = advisory;
		component.type = 'field';

		component.ngOnInit();

		tick();

		expect(component.advisoryId)
			.toEqual(_.toString(advisory.id));
	}));

	it('should clear all pieces if invalid type', fakeAsync(() => {
		const advisory: FieldNoticeAdvisory =
			getActiveBody(FieldNoticeAdvisoryScenarios[0]).data[0];

		component.advisory = advisory;
		_.set(component, 'type', 'field-notice');

		component.ngOnInit();

		tick();

		expect(component.advisoryId)
			.toBeNull();
		expect(component.title)
			.toBeNull();
		expect(component.type)
			.toBeNull();
		expect(component.advisory)
			.toBeNull();
	}));

	it('should clear all pieces if panel closes', fakeAsync(() => {
		const advisory: FieldNoticeAdvisory =
			getActiveBody(FieldNoticeAdvisoryScenarios[0]).data[0];

		component.advisory = advisory;
		component.type = 'field';

		component.ngOnInit();

		tick();

		expect(component.advisoryId)
			.toEqual(_.toString(advisory.id));

		component.onPanelClose();

		tick();

		expect(component.advisoryId)
			.toBeNull();
		expect(component.title)
			.toBeNull();
		expect(component.type)
			.toBeNull();
		expect(component.advisory)
			.toBeNull();
	}));

	it('should handle on panel hidden', () => {
		const panelCloseSpy = jest.spyOn(component, 'onAllPanelsClose');
		component.handleHidden(false);
		expect(panelCloseSpy)
			.not
			.toHaveBeenCalled();

		component.handleHidden(true);
		expect(panelCloseSpy)
			.toHaveBeenCalled();
	});

	it('should pop panel on back', () => {
		jest.spyOn(detailsPanelStackService, 'pop');

		component.onPanelBack();

		expect(detailsPanelStackService.pop)
				.toHaveBeenCalled();
	});

	it('should reset stack service', () => {
		jest.spyOn(detailsPanelStackService, 'reset');

		component.onAllPanelsClose();

		expect(detailsPanelStackService.reset)
			.toHaveBeenCalled();
	});

});
