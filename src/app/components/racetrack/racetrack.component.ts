import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

import * as d3 from 'd3-selection';
import { d3Transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';
import { scalePow } from 'd3-scale';
import * as _ from 'lodash';

d3.transition = d3Transition;

/**
 * Mapping of stage names to distance along path
 *
 * @interface StageMap
 */
interface StageMap {
	[propName: string]: number;
}

/**
 * RacetrackComponent
 */
@Component({
	selector: 'app-racetrack',
	templateUrl: './racetrack.component.html',
})
export class RacetrackComponent implements OnInit {
	public racecar: d3.SVGElement;
	public svg: d3.SVGElement;
	public track: d3.SVGElement;
	public progress: d3.SVGElement;
	public length: number;
	public progressSoFar: number;
	public stageMap: StageMap;
	public stages: string[];
	public points: DOMPoint[];
	public current: string;

	@Input('stage') public stage: string;

	/**
	 * Initializes racetrack variables and begins first animation
	 *
	 * @memberof RacetrackComponent
	 */
	public ngOnInit () {
		const svg = d3.select('#racetrack-composite');
		const racecar = svg.select('#racecar');
		const track = svg.select('#secrettrack');
		const progress = svg.select('#progress');
		const length = track.node()
			.getTotalLength();

		this.svg = svg;
		this.racecar = racecar;
		this.track = track;
		this.progress = progress;
		this.length = length;

		/**
		 * @TODO figure out how to replace this 'any'
		 */
		let points: any[] = Array.from({ length: 200 })
			.fill(null);

		points = points.map((_pt, i: number) => {
			const distance = ((length / points.length) * i);

			return track.node()
				.getPointAtLength(distance);
		})
			.reverse(); // reversed because #secrettrack path goes in wrong direction

		this.points = points;

		// Shove the points array onto the track so Cypress tests have access to it
		this.track.attr('pointsLength', this.points.length);
		this.points.forEach((point, index) => {
			this.track.attr(`point${index}x`, point.x);
			this.track.attr(`point${index}y`, point.y);
		});

		// at what % of the path does the stop for each stage fall
		// (path does not start at 'purchase' stage)
		this.stageMap = {
			adopt: 99.5,
			advocate: 16,
			engage: 95,
			evaluate: 43,
			implement: 87,
			need: 33,
			onboard: 82,
			optimize: 4.5,
			purchase: 66,
			recommend: 12,
			renew: 8,
			select: 54,
			use: 91,
		};

		Object.keys(this.stageMap)
			.forEach(key => {
				// convert % points to use granularity of this.points
				this.stageMap[key] *= (points.length / 100);
			});

		this.stages = [
			'need',
			'evaluate',
			'select',
			'purchase',
			'onboard',
			'implement',
			'use',
			'engage',
			'adopt',
			'optimize',
			'renew',
			'recommend',
			'advocate',
		];

		this.current = 'purchase';

		d3.select(this.track.node().parentNode)
			.selectAll('.stage')
			.data(this.stages)
			.enter()
			.append('circle')
				.classed('stage', true)
				.style('cursor', 'pointer')
				.attr('fill', 'white')
				.attr('r', 5)
				.attr('cx', name => {
					const dist = this.stageMap[name];

					return points[dist].x;
				})
				.attr('cy', name => {
					const dist = this.stageMap[name];

					return points[dist].y;
				})
				.attr('transform', () =>
					this.track.attr('transform'))
				.attr('data-auto-id', name => `Racetrack-Point-${name}`)
				.raise()
				.on('click', d => this.zoomToStage(d, true));

		// uncomment to see dots at each half-percent of the racetrack, click a dot to log its %
		// d3.select(track.node().parentNode).append('g').selectAll('circle')
		// 	.data(points)
		// 	.enter()
		// 		.append('circle')
		// 		.style('cursor', 'pointer')
		// 		.attr('cx', d => d.x - 22.61) // magic numbers from transform on #secrettrack path
		// 		.attr('cy', d => d.y - 287.23)
		// 		.attr('r', 3)
		// 		.attr('fill', 'red')
		// 		.on('click', (d, i) => {
		// 			console.log('clicked', i, d);
		// 		});

		this.racecar.raise();

		// progress bar starts from 'purchase' step
		const purchaseDistance = ((points.length - this.stageMap.purchase) *
			(this.length / points.length) - 7);

		this.progress.attr('stroke', '#56C332')
			.attr('stroke-width', 6)
			.attr('stroke-linecap', 'round')
			.attr('stroke-dasharray', '0 1')
			.attr('stroke-dashoffset', purchaseDistance);

		// set up left and right arrow functionality
		svg.select('#racetrack-left')
			.style('cursor', 'pointer')
			.style('color', '#BABBBD')
			.on('click', () => this.zoomToPrevious());
		svg.select('#racetrack-right')
			.style('cursor', 'pointer')
			.style('color', '#BABBBD')
			.on('click', () => this.zoomToNext());

		racecar.style('cursor', 'pointer')
			.on('click', () => this.zoomToNext());

		// customer has already purchased, starts at onboarding
		this.zoomToStage(this.stage, true);
	}

	/**
	 * Does a victory lap, then moves car to the specified stage.
	 * If trackProgress is true, also extends progress bar to specified stage.
	 *
	 * @param {string} endpoint Name of stage to move to
	 * @param {boolean} trackProgress Should progress bar follow car
	 * @memberof RacetrackComponent
	 */
	public zoomToStage (endpoint: string, trackProgress = false) {
		const start = this.stageMap[this.current];
		const end = this.stageMap[endpoint];

		let points = [
			...this.points.slice(start),
			...this.points.slice(0, end + 1),
		];

		// if wrapping around the 'end' of the path, add an extra loop
		if (end < start) {
			points = [...points, ...this.points.slice(end + 1), ...this.points.slice(0, end + 1)];
		}

		// rotate car to match track
			// uses current point and next point to calculate angle
		const rotations = points.map((pt1, i) => {
			let pt2;
			if (i < points.length - 1) {
				pt2 = points[i + 1];
			} else {
				// make sure ending angle matches track
					// if going from pt 199 to pt 0, don't ask for point 200 (which does not exist)
				pt2 = this.points[end + 1] || this.points[0];
			}
			// svg coordinate system has origin at top left, so Y calculation is reversed
			const deltaY = (pt1.y - pt2.y);
			const deltaX = (pt2.x - pt1.x);
			const result = Math.atan2(deltaY, deltaX) * 180 / Math.PI;

			return 360 - result;
		});

		// prevent duration of any segment of the transition from being too long or short
		const scaleDuration = scalePow()
			.domain([0, 0.3])
			.range([8, 150])
			.exponent(2.5);

		points.reduce((chain, pt, i) => {
			// skip half of the points to speed up animation, reduce calculations
			// However, make sure we don't skip the last point
			if (i % 2 && i !== points.length - 1) { return chain; }

			// each segment of transition gets its own duration from a parabolic function
				// (slower at beginning and end, faster in the middle)
			const parabolicDuration = Math.pow(Math.abs((i / (points.length - 15)) - 0.5), 3);
			const dur = scaleDuration(parabolicDuration);

			return chain.transition()
				.duration(dur)
				.ease(easeLinear)
				// this.track.attr('transform') puts car on track
				// first 'translate' puts car at point on track
				// rotate sets angle of car, 17 is magic number to get car svg horizontal
				// second 'translate' is to put center of car over the endpoint
				.attr('transform', () => `${this.track.attr('transform')}
					translate(${[pt.x, pt.y]})
					rotate(${17 + rotations[i]})
					translate(-15, -20)`)
				.on('start', () => {
					window.carMoving = true;
				})
				.on('end', () => {
					window.carMoving = false;
				});
		}, this.racecar);

		this.current = endpoint;

		if (trackProgress) {
			const progressDistance = (end - this.stageMap.purchase < 0 ?
				(end + this.points.length) - this.stageMap.purchase :
				end - this.stageMap.purchase) * this.length / this.points.length;

			const progressSoFar = this.progressSoFar || 0;

			this.progress.attr('stroke-dasharray',
				`${progressSoFar} ${this.length - (progressSoFar)}`);

			this.progress.transition()
				.delay(500)
				.duration(2000)
				.attr('stroke-dasharray', `${progressDistance} ${this.length - progressDistance}`);

			this.progressSoFar = progressDistance;
		}
	}

	/**
	 * Does a victory lap, then moves to next stage in sequence
	 *
	 * @param {boolean} trackProgress Should progress bar follow car
	 * @memberof RacetrackComponent
	 */
	public zoomToNext (trackProgress = false) {
		let next = this.stages.indexOf(this.current) + 1;

		if (next === this.stages.length) { next = 0; }

		this.zoomToStage(this.stages[next], trackProgress);
	}

	/**
	 * Does a victory lap, then moves to previous stage in sequence
	 *
	 * @param {boolean} trackProgress Should progress bar follow car
	 * @memberof RacetrackComponent
	 */
	public zoomToPrevious (trackProgress = false) {
		let prev = this.stages.indexOf(this.current) - 1;

		if (prev === -1) { prev = this.stages.length - 1; }

		this.zoomToStage(this.stages[prev], trackProgress);
	}

	/**
	 * Checks if our current status has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const currentStage = _.get(changes, ['stage', 'currentValue']);
		if (currentStage && !changes.stage.firstChange) {
			this.zoomToStage(currentStage, true);
		}
	}
}
