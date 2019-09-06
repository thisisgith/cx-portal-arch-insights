import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { I18n } from '@cisco-ngx/cui-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TimelineComponent } from './timeline.component';
import { TimelineModule } from './timeline.module';
import {
	allTimelineData,
	oneFutureOnePastTimelineData,
	onlyFutureTimelineData,
	onlyPastTimelineData,
} from './test-data.const';

import * as enUSJson from '../../../assets/i18n/en-US.json';

describe('TimelineComponent', () => {
	let component: TimelineComponent;
	let fixture: ComponentFixture<TimelineComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				TimelineModule,
			],
		});
	});

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);

		fixture = TestBed.createComponent(TimelineComponent);
		component = fixture.componentInstance;
		// de = fixture.debugElement;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should render the provided datapoints', () => {
		component.data = allTimelineData;
		fixture.detectChanges();
		expect(component.timestampsEven.length)
			.toBe(5);
	});

	it('should draw timeline correctly with all datapoints', () => {
		component.data = allTimelineData;
		fixture.detectChanges();
		expect(component.blueTimelineWidth)
			.toBe('700px');
		expect(component.grayTimelineWidth)
			.toBe('302px');
		expect(component.timestampsEven.length)
			.toBe(5);
		expect(component.timestampsOdd.length)
			.toBe(6);
	});

	it('should draw timeline correctly with one future and one past datapoint', () => {
		component.data = oneFutureOnePastTimelineData;
		fixture.detectChanges();
		expect(component.blueTimelineWidth)
			.toBe('100px');
		expect(component.grayTimelineWidth)
			.toBe('102px');
		expect(component.timestampsEven.length)
			.toBe(1);
		expect(component.timestampsOdd.length)
			.toBe(2);
	});

	it('should draw timeline correctly with only past datapoints', () => {
		component.data = onlyPastTimelineData;
		fixture.detectChanges();
		expect(component.blueTimelineWidth)
			.toBe('600px');
		expect(component.grayTimelineWidth)
			.toBe('0px');
		expect(component.timestampsEven.length)
			.toBe(3);
		expect(component.timestampsOdd.length)
			.toBe(4);
	});

	it('should draw timeline correctly with only future datapoints', () => {
		component.data = onlyFutureTimelineData;
		fixture.detectChanges();
		expect(component.blueTimelineWidth)
			.toBe('0px');
		expect(component.grayTimelineWidth)
			.toBe('302px');
		expect(component.timestampsEven.length)
			.toBe(2);
		expect(component.timestampsOdd.length)
			.toBe(2);
	});

	it('should apply muted class when option is supplied', () => {
		component.data = allTimelineData;
		fixture.detectChanges();
		const elems = fixture.debugElement
			.queryAll(By.css('.pbc-timeline__timestamp--content-bottom'));
		expect(elems[elems.length - 1].classes['text-muted'])
			.toBe(true);
	});

	it('should not render "Today Button" when todayButtonText option is not supplied', () => {
		component.data = allTimelineData;
		fixture.detectChanges();
		const de = fixture.debugElement.query(By.css('button'));
		expect(de)
			.toBeNull();
	});

	it('should render "Today Button" when todayButtonText option is supplied', () => {
		component.data = allTimelineData;
		component.todayButtonText = 'Click Here';
		fixture.detectChanges();
		const de = fixture.debugElement.query(By.css('button'));
		expect(de.nativeElement)
			.toBeDefined();
	});

	it('should emit an event when "Today Button" is clicked', async(() => {
		component.data = allTimelineData;
		component.todayButtonText = 'Click Here';
		spyOn(component.todayButtonClick, 'emit');
		fixture.detectChanges();
		const button = fixture.debugElement.query(By.css('button'));
		button.nativeElement.dispatchEvent(new Event('click'));
		fixture.detectChanges();
		expect(component.todayButtonClick.emit)
			.toHaveBeenCalled();
	}));

	it('should not render anything with no data', () => {
		const de = fixture.debugElement.query(By.css('.pbc-timeline__timestamp'));
		expect(de)
			.toBeNull();
	});
});
