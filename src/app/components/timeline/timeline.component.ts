import {
	Component,
	DoCheck,
	EventEmitter,
	Input,
	IterableDiffer,
	IterableDiffers,
	OnInit,
	Output,
} from '@angular/core';
import { TimelineDatapoint, TimelineInternalDatapoint, TodayRelation } from '@interfaces';

/**
 * Horizontally-oriented timeline component
 */
@Component({
	selector: 'pbc-timeline',
	styleUrls: ['./timeline.component.scss'],
	templateUrl: './timeline.component.html',
})
export class TimelineComponent implements DoCheck, OnInit {
	@Input() public data: (TimelineDatapoint)[] = [];
	@Input() public todayButtonText: string;
	@Output() public todayButtonClick: EventEmitter<void> = new EventEmitter<void>();
	public timestampsEven: TimelineInternalDatapoint[];
	public timestampsOdd: TimelineInternalDatapoint[];
	public blueTimelineWidth = '0px';
	public grayTimelineWidth = '0px';
	private numFutureDatapoints = 0;
	private iterableDiffer: IterableDiffer<TimelineDatapoint>;

	constructor (private differ: IterableDiffers) {
		this.iterableDiffer = this.differ.find(this.data)
			.create();
	}

	/**
	 * NgDoCheck
	 */
	public ngDoCheck () {
		const changes = this.iterableDiffer.diff(this.data);
		if (changes) {
			this.convertData();
		}
	}

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		this.convertData();
	}

	/**
	 * Converts input data to a format that is required by the component layout
	 */
	private convertData () {
		if (this.data && Array.isArray(this.data) && this.data.length) {
			const sortedData = this.sortData();
			const dataWithTodayInserted = this.getDataWithTodayInserted(sortedData);
			this.divideInputData(dataWithTodayInserted);
			this.setTimelineLineWidths();
		}
	}

	/**
	 * Inserts a special element in the data to reference where the "Today" marker
	 * should be placed. Does not modify the data array, returns a new array
	 * @param data {TimelineDatapoint[]}
	 * @returns array {TimelineInternalDatapoint[]}
	 */
	private getDataWithTodayInserted (data: TimelineDatapoint[]) {
		const today = new Date();
		const todayRef: TodayRelation = { isToday: true };

		let todayInserted = false;

		return data.reduce((memo, timestamp, idx) => {
			const timestampClone: TimelineInternalDatapoint = Object.assign({ }, timestamp);
			if (
				(<TimelineDatapoint> timestamp).date > today
			) {
				if (!todayInserted) {
					memo.push(todayRef);
					todayInserted = true;
					this.numFutureDatapoints = data.length - idx;
				}
				timestampClone.isFuture = true;
			} else {
				timestampClone.isPast = true;
			}

			memo.push(timestampClone);

			if (idx === (data.length - 1) && !todayInserted) {
				memo.push(todayRef);
			}

			return memo;
		}, []);
	}

	/**
	 * Ensure the input data is sorted by timestamp
	 * @returns sortedData {TimelineDatapoint[]}
	 */
	private sortData () {
		return this.data.concat()
			.sort((timestampA, timestampB) => {
				if (timestampA.date > timestampB.date) {
					return 1;
				}
				if (timestampB.date > timestampA.date) {
					return -1;
				}

				return 0;
			});
	}

	/**
	 * Divides the input data into two arrays (odd elements in one and even elements in the other)
	 * This needs to be done so that some timestamps are displayed above the timeline and some are
	 * displayed below the timeline.
	 * @param data {(TimelineDatapoint | TodayRelation)[]}
	 */
	private divideInputData (data: (TimelineDatapoint & TodayRelation)[]) {
		this.timestampsEven = data.filter((_datapoint, idx) => (idx + 1) % 2 === 0);
		this.timestampsOdd = data.filter((_datapoint, idx) => (idx + 1) % 2 === 1);
	}

	/**
	 * Sets the widths for rendering the vertically center horizontal line
	 */
	private setTimelineLineWidths () {
		if (this.data.length > this.numFutureDatapoints) {
			this.blueTimelineWidth = `${((this.data.length - this.numFutureDatapoints) * 100)}px`;
		}
		if (this.numFutureDatapoints) {
			this.grayTimelineWidth = `${(this.numFutureDatapoints * 100) + 2}px`;
		}
	}
}
