import {
	Component,
	OnInit,
	Input,
	Pipe,
	PipeTransform,
} from '@angular/core';
import * as _ from 'lodash-es';

/** Interface for a Tooltip */
export interface Step {
	title?: string;
	description?: string;
	arrows?: number;
	stepIndex?: number;
	data?: {
		active?: boolean;
		top?: number;
		left?: number;
	};
	maxHeight?: number;
	maxWidth?: number;
	relative?: boolean;
	stepPos?: 'top' | 'left' | 'bottom' | 'right';
}

/**
 * NumToArrayPipe
 */
@Pipe({ name: 'arrowPos' })
export class ArrowPipe implements PipeTransform {
	/**
	 * Returns an iterable of length value
	 * @param value length of array
	 * @returns iterable of length value
	 */
	public transform (value: number): Iterable<number> {
		const iterable = <Iterable<number>> { };
		iterable[Symbol.iterator] = function* () {
			const times = _.floor(value / 2);
			let n = -1 - times;
			const div = 100 / value;
			let positions = 50 + div * n;
			while (n < times) {
				n += 1;
				yield positions += div;
			}
		};

		return iterable;
	}
}

/**
 * NumToArrayPipe
 */
@Pipe({ name: 'times' })
export class TimesPipe implements PipeTransform {
	/**
	 * Returns an iterable of length value
	 * @param value length of array
	 * @returns iterable of length value
	 */
	public transform (value: number): Iterable<number> {
		const iterable = <Iterable<number>> { };
		iterable[Symbol.iterator] = function* () {
			let n = -1;
			while (n < value - 1) {
				yield n += 1;
			}
		};

		return iterable;
	}
}

/** OFFSET of arrows */
const OFFSET = 20;

/**
 * QuickTourComponent
 */
@Component({
	selector: 'quick-tour',
	styleUrls: ['./quick-tour.component.scss'],
	templateUrl: './quick-tour.component.html',
})
export class QuickTourComponent implements OnInit {

	@Input() public steps: Step[];
	public currentIndex;
	public open;
	public lastIndex;

	/**
	 * Initializes Quick Tour Component
	 */
	public ngOnInit () {
		this.currentIndex = undefined;
		this.lastIndex = undefined;
		this.open = true;
		if (_.size(this.steps)) {
			this.currentIndex = _.reduce(this.steps,
				(memo, step) => step.stepIndex < memo ? step.stepIndex : memo,
				this.steps[0].stepIndex);
			this.lastIndex = _.reduce(this.steps,
				(memo, step) => step.stepIndex > memo
					? (step.data.active && step.stepIndex) || memo
					: memo,
				this.steps[0].stepIndex);
		}
	}

	/**
	 * Increment currentIndex to go to the next step
	 */
	public nextStep () {
		this.currentIndex += 1;
		while (this.currentIndex < this.lastIndex && !_.get(this,
				['steps', this.currentIndex])) {
			this.currentIndex += 1;
		}
		this.open = this.currentIndex <= this.lastIndex;
	}

	/**
	 * Closes the Quick Tour
	 */
	public close () {
		this.open = false;
	}

	/**
	 * Translate the step container w.r.t. to a position
	 * @param step step to translate
	 * @returns translation for css
	 */
	public getTranslate (step: Step) {
		switch (_.get(step, 'stepPos')) {
			case 'top':
				return 'translate(-50%, -50%)';
			case 'left':
				return 'translate(-100%, -50%)';
			case 'right':
				return 'translate(0%, -50%)';
			default:
				return 'translate(-50%, 0%)';
		}
	}

	/**
	 * Gets the left value for the container
	 * @param step step to move
	 * @returns left for css
	 */
	public getLeft (step: Step) {
		if (!_.get(step, ['data', 'left'])) {
			return '0px';
		}
		switch (_.get(step, 'stepPos')) {
			case 'right':
				return `${step.data.left + OFFSET}px`;
			case 'left':
				return `${step.data.left - OFFSET}px`;
			default:
				return `${step.data.left}px`;
		}
	}

	/**
	 * Gets the top value for the container
	 * @param step step to move
	 * @returns top for css
	 */
	public getTop (step: Step) {
		if (!_.get(step, ['data', 'top'])) {
			return '0px';
		}
		switch (_.get(step, 'stepPos')) {
			case 'top':
				return `${step.data.top - OFFSET}px`;
			case 'bottom':
				return `${step.data.top + OFFSET}px`;
			default:
				return `${step.data.top}px`;
		}
	}

	/**
	 * Gets the top position for an arrow for CSS
	 * @param step step to move
	 * @param pos position in axis
	 * @returns arrow top
	 */
	public getArrowTop (step: Step, pos: number) {
		if (!pos) {
			return '0%';
		}
		switch (_.get(step, 'stepPos')) {
			case 'top':
				return '100%';
			case 'bottom':
				return '0%';
			default:
				return `${pos}%`;
		}
	}

	/**
	 * Gets the left position for an arrow for CSS
	 * @param step step to move
	 * @param pos position in axis
	 * @returns arrow left
	 */
	public getArrowLeft (step: Step, pos: number) {
		if (!pos) {
			return '0%';
		}
		switch (_.get(step, 'stepPos')) {
			case 'left':
				return '100%';
			case 'right':
				return '0%';
			default:
				return `${pos}%`;
		}
	}
}
