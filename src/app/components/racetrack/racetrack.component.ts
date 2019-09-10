import {
	Component,
	OnInit,
	Input,
	SimpleChanges,
	Output,
	EventEmitter,
} from '@angular/core';
import { PlatformLocation } from '@angular/common';


import * as d3 from 'd3-selection';
import { d3Transition } from 'd3-transition';
import { easeLinear } from 'd3-ease';
import { scalePow } from 'd3-scale';
import * as _ from 'lodash-es';
import { Subject } from 'rxjs';

d3.transition = d3Transition;

/**
 * Mapping of stage names to distance along path
 *
 * @interface StageMap
 */
export interface StageMap {
	[propName: string]: {
		distance: number;
		active?: boolean;
		label?: {
			x: number;
			y: number;
			anchor: string;
		}
	};
}

// These are exported so Cypress can access them
/**
 * carCenterOffsetX - Offset to center the car (X direction)
 */
export const carCenterOffsetX = -15;
/**
 * carCenterOffsetY - Offset to center the car (Y direction)
 */
export const carCenterOffsetY = -20;
/**
 * carBaseRotations - 17 is magic number to get car svg horizontal
 */
export const carBaseRotations = 17;
/**
 * trackOffsetX - Offset to center the track in the svg (X direction)
 */
export const trackOffsetX = -22.61;
/**
 * trackOffsetY - Offset to center the track in the svg (Y direction)
 */
export const trackOffsetY = -287.23;

/**
 * commented out pitstops are disabled at this time.
 * may be re-enabled in the future
 * stages - list of possible racetrack stages
 */
export const stages = [
	// 'need',
	// 'evaluate',
	// 'select',
	// 'purchase',
	'onboard',
	'implement',
	'use',
	'engage',
	'adopt',
	'optimize',
	// 'renew',
	// 'recommend',
	// 'advocate',
];

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

	public preview: d3.SVGElement;
	private stageCircles: d3.SVGElement;
	private stageLabels: d3.SVGElement;
	private selectedLabels: d3.SVGElement;
	public length: number;
	public progressSoFar: number;
	public previewSoFar: number;
	public stageMap: StageMap;
	public stages: string[];
	public points: DOMPoint[];
	public current: string;

	@Input('stage') public stage: string;
	@Input('currentStage') public currentStage: string;
	@Output() public onStageChange = new EventEmitter<string>();

	constructor (
		private platformLocation: PlatformLocation,
	) { }

	/**
	 * Initializes racetrack variables and begins first animation
	 *
	 * @memberof RacetrackComponent
	 */
	public ngOnInit () {
		const self = this;

		const svg = d3.select('#racetrack-composite');
		const racecar = svg.select('#racecar');
		const track = svg.select('#secrettrack');
		const progress = svg.select('#progress');
		const preview = svg.select('#preview');
		const length = track.node()
			.getTotalLength();

		this.svg = svg;
		this.racecar = racecar;
		this.track = track;
		this.progress = progress;
		this.preview = preview;
		this.length = length;

		this.track.attr('transform', `translate(${trackOffsetX} ${trackOffsetY})`);

		if (window.Cypress) {
			window.racetrackEvents = new Subject();
		}

		this.svg.append('defs')
			.append('filter')
				.attr('id', 'drop-shadow')
				.attr('y', '-30%')
				.attr('x', '-30%')
				.attr('width', '160%')
				.attr('height', '160%')
			.append('feDropShadow')
				.attr('dx', 0)
				.attr('dy', 0)
				.attr('stdDeviation', 2)
				.attr('flood-opacity', 0.4);

		/**
		 * @TODO: figure out how to replace this 'any'
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
		this.track.attr('tracklength', this.length);
		this.track.attr('pointslength', this.points.length);
		this.points.forEach((point, index) => {
			this.track.attr(`point${index}x`, point.x);
			this.track.attr(`point${index}y`, point.y);
		});

		// at what % of the path does the stop for each stage fall
		// (path does not start at 'purchase' stage)
		this.stageMap = {
			need: {
				distance: 33,
			},
			evaluate: {
				distance: 43,
			},
			select: {
				distance: 54,
			},
			purchase: {
				distance: 66,
			},
			onboard: {
				distance: 82,
				label: {
					x: -26,
					y: 55,
					anchor: 'middle',
				},
			},
			implement: {
				distance: 87,
				label: {
					x: 0,
					y: 53,
					anchor: 'start',
				},
			},
			use: {
				distance: 91,
				label: {
					x: 36,
					y: 23,
					anchor: 'start',
				},
			},
			engage: {
				distance: 95,
				label: {
					x: 20,
					y: 6,
					anchor: 'start',
				},
			},
			adopt: {
				distance: 99.5,
				label: {
					x: 20,
					y: 6,
					anchor: 'start',
				},
			},
			optimize: {
				distance: 4.5,
				label: {
					x: 20,
					y: -3,
					anchor: 'start',
				},
			},
			renew: {
				distance: 8,
			},
			recommend: {
				distance: 12,
			},
			advocate: {
				distance: 16,
			},
		};

		Object.keys(this.stageMap)
			.forEach(key => {
				// convert % points to use granularity of this.points
				this.stageMap[key].distance *= (points.length / 100);
			});

		// Setting racecar circle filter in here (need to append location to fix Safari bug).
		// Inspired by: https://stackoverflow.com/questions/39345823/angular2-svg-filter-url
		const dropShadowUrl = `url(${this.platformLocation.pathname}#drop-shadow)`;
		this.racecar.select('circle')
			.attr('filter', dropShadowUrl);

		this.current = 'purchase';

		this.stageCircles = d3.select(this.track.node().parentNode)
			.selectAll('.stage')
			.data(stages)
			.enter()
			.append('circle')
				.classed('stage', true)
				.style('cursor', 'pointer')
				.attr('fill', 'white')
				.attr('r', 5)
				.attr('cx', name => {
					const dist = this.stageMap[name].distance;

					return points[dist].x;
				})
				.attr('cy', name => {
					const dist = this.stageMap[name].distance;

					return points[dist].y;
				})
				.attr('transform', () =>
					this.track.attr('transform'))
				.attr('data-auto-id', name => `Racetrack-Point-${name}`)
				.raise()
				.on('click', d =>  {
					// this.onStageChange.emit(d);
					this.zoomToStage(d, false);
				})
				.on('mouseenter', function (d) {
					if (d === self.currentStage) {
						return;
					}

					if (stages.indexOf(d) > stages.indexOf(self.currentStage)) {
						d3.select(this)
							.transition()
							.duration(50)
							.attr('fill', '#14bdf4');
					}

					// self.stageLabels.filter(dd => dd.name === d)
					// 	.style('font-weight', 'bold');
				})
				.on('mouseleave', function (d) {
					if (d === self.current) {
						return;
					}

					d3.select(this)
						.transition()
						.duration(50)
						.attr('fill', 'white');

					// self.stageLabels.style('font-weight', 'normal');
				});

		const labelsEnter = d3.select(this.track.node().parentNode)
			.selectAll('.stage-label')
			.data(_.reduce(JSON.parse(JSON.stringify(this.stageMap)), (acc, stage, stageName) => {
				if (stage.label) {
					stage.name = stageName;
					acc.push(stage);
				}

				return acc;
			}, []))
			.enter();

		const selectedLabelHeight = 40;

		this.selectedLabels = labelsEnter.append('g')
			.classed('selected-label', true)
			.attr('transform', d => {
				const dist = this.stageMap[d.name].distance;

				if (d.name === 'onboard' || d.name === 'implement') {
					return `${this.track.attr('transform')}
					translate(${[points[dist].x - 90, points[dist].y + 25]})`;
				}

				return `${this.track.attr('transform')}
				translate(${[points[dist].x + 20, points[dist].y - selectedLabelHeight / 2]})`;
			})
			.attr('opacity', 0);

		this.selectedLabels.append('rect')
			.attr('height', selectedLabelHeight)
			.attr('width', d => d.name.length * 12 + 20)
			.attr('fill', '#b1e8f1')
			.attr('stroke', 'white')
			.attr('stroke-width', 3)
			.attr('rx', 4);

		this.selectedLabels.append('polygon')
			.attr('points', '4,10 16,4 16,16')
			.attr('fill', 'white')
			.attr('transform', d => {
				if (d.name === 'onboard') {
					return 'translate(99, -16) rotate(90)';
				}
				if (d.name === 'implement') {
					return 'translate(101, -16) rotate(90)';
				}

				return 'translate(-16, 10)';
			});

		this.selectedLabels.append('polygon')
			.attr('points', '7,11 17,6.5 17,15.5')
			.attr('fill', '#b1e8f1')
			.attr('transform', d => {
				if (d.name === 'onboard') {
					return 'translate(100, -15) rotate(90)';
				}
				if (d.name === 'implement') {
					return 'translate(102, -15) rotate(90)';
				}

				return 'translate(-15, 9)';
			});

		this.selectedLabels.append('text')
			.text(d => d.name)
			.attr('font-weight', 600)
			.attr('font-style', 'oblique')
			.attr('fill', '#535e6b')
			.attr('font-size', 20)
			.attr('transform', `translate(10, ${selectedLabelHeight / 2 + 8})`);

		this.stageLabels = labelsEnter.append('text')
			.classed('stage-label', true)
			.text(d => d.name)
			.attr('transform', d => {
				const dist = this.stageMap[d.name].distance;

				return `${this.track.attr('transform')}
					translate(${[points[dist].x + d.label.x, points[dist].y + d.label.y]})`;
			})
			.attr('text-anchor', d => d.label.anchor)
			.attr('font-size', '22px')
			.attr('fill', '#535e6b')
			.style('font-family', 'Arial')
			.style('cursor', 'pointer')
			.raise()
			.on('click', d => this.zoomToStage(d.name, false))
			.on('mouseenter', function (d) {
				if (d.name === self.currentStage) {
					return;
				}

				d3.select(this)
					.style('font-weight', 'bold');

				self.stageCircles.filter(dd => dd === d.name &&
						stages.indexOf(d.name) > stages.indexOf(self.currentStage))
					.transition()
					.duration(50)
					.attr('fill', '#14bdf4');
			})
			.on('mouseleave', function (d) {
				if (d.name === self.current) {
					return;
				}

				d3.select(this)
					.style('font-weight', 'normal');

				self.stageCircles.filter(dd => dd === d.name)
					.transition()
					.duration(50)
					.attr('fill', 'white');
			});

		this.refreshLabels();

		this.svg.on('mouseover', () => {
			this.stageLabels.transition()
				.duration(200)
				.attr('opacity', 1);
		})
		.on('mouseleave', this.refreshLabels.bind(this));

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
		const purchaseDistance = ((points.length - this.stageMap.purchase.distance) *
			(this.length / points.length) - 7);

		this.progress.attr('stroke', '#14bdf4')
			.attr('stroke-width', 17)
			.attr('stroke-linecap', 'round')
			.attr('stroke-dasharray', '0 1')
			.attr('stroke-dashoffset', purchaseDistance);

		this.preview.attr('stroke', 'white')
			.attr('stroke-width', 2)
			.attr('stroke-dasharray', '0 1');

		// set up left and right arrow functionality
		svg.select('#racetrack-left')
			.style('cursor', 'pointer')
			.on('click', () => this.zoomToPrevious());
		svg.select('#racetrack-right')
			.style('cursor', 'pointer')
			.on('click', () => this.zoomToNext());

		racecar.style('cursor', 'pointer')
			.on('click', () => this.zoomToStage(this.currentStage.toLowerCase(), false));

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
		this.current = endpoint;

		this.refreshLabels();
		this.stageLabels.filter(d => d.name !== this.current)
			.style('font-weight', 'normal');

		const dropShadowUrl = `url(${this.platformLocation.pathname}#drop-shadow)`;

		this.stageCircles.transition()
			.duration(300)
			.attr('r', 7)
			.attr('filter', 'none')
			.attr('fill', 'white')
			.attr('stroke-width', 0)
			.filter(d => d === this.current && d !== this.currentStage.toLowerCase())
				.attr('r', 12)
				.attr('fill', '#14bdf4')
				.attr('stroke', 'white')
				.attr('stroke-width', 5)
				.attr('filter', dropShadowUrl)

		const start = this.stageMap[this.currentStage.toLowerCase()].distance;
		const end = this.stageMap[endpoint].distance;

		let points = [
			...this.points.slice(start),
			...this.points.slice(0, end + 1),
		];

		this.selectedLabels.attr('opacity', 0)
			.lower();

		this.stageLabels.style('visibility', 'visible');

		// Only changing selected stage, not racecar stage
		if (!trackProgress) {
			// show the selected label for the selected stage
			this.selectedLabels.filter(d => d.name === endpoint && d.name !== this.currentStage.toLowerCase())
				.attr('opacity', 1)
				.raise();

			this.stageLabels.filter(d => d.name === endpoint && d.name !== this.currentStage.toLowerCase())
				.style('visibility', 'hidden');

			if (stages.indexOf(endpoint) < stages.indexOf(this.currentStage.toLowerCase())) {
				this.preview.attr('opacity', 0);

				return;
			}
			this.preview.attr('opacity', 1);

			// show preview line from racetrack to selected
			const offset = ((this.points.length - this.stageMap[this.currentStage.toLowerCase()].distance) *
			(this.length / this.points.length) - 7);

			this.preview.attr('stroke-dashoffset', offset);

			const previewDistance = (end - start < 0 ?
				(end + this.points.length) - start :
				end - start) * this.length / this.points.length;

			const previewSoFar = this.previewSoFar || 0;

			this.preview.attr('stroke-dasharray',
				`${previewSoFar} ${this.length - (previewSoFar)}`);

			this.preview.transition()
				.duration(1000)
				.attr('stroke-dasharray', `${previewDistance} ${this.length - previewDistance}`);

			this.previewSoFar = previewDistance;

			return;
		}

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

		if (endpoint.toLowerCase() === this.currentStage.toLocaleLowerCase()) {
			points.reduce((chain, pt, i) => {
				// skip half of the points to speed up animation, reduce calculations
				// However, make sure we don't skip the last point
				if (i % 2 && i !== points.length - 1) { return chain; }

				// each segment of transition gets its own duration from a parabolic function
					// (slower at beginning and end, faster in the middle)
				const parabolicDuration = Math.pow(Math.abs((i / (points.length - 15)) - 0.5), 3);
				let dur;
				if (window.Cypress) {
					dur = 5; // speed up animation for cypress runs
				} else {
					dur = scaleDuration(parabolicDuration);
				}

				return chain.transition()
					.duration(dur)
					.ease(easeLinear)
					// this.track.attr('transform') puts car on track
					// first 'translate' puts car at point on track
					// rotate sets angle of car,
					// 17 (carBaseRotations) is magic number to get car svg
					// horizontal second 'translate' is to put center of car over the endpoint
					.attr('transform', () => `${this.track.attr('transform')}
						translate(${[pt.x, pt.y]})
						rotate(${carBaseRotations + rotations[i]})
						translate(${carCenterOffsetX}, ${carCenterOffsetY})`)
					.on('start', () => {
						// Only fire the carMovingStart event for the FIRST transition
						if (window.Cypress && i === 0) {
							window.racetrackEvents.next({ id: 'carMovingStart' });
						}
					})
					.on('end', () => {
						// Only fire the carMovingEnd event for the LAST transition
						if (window.Cypress && i === points.length - 1) {
							window.racetrackEvents.next({ id: 'carMovingEnd' });
						}
					});
			}, this.racecar);
		}

		this.current = endpoint;

		if (trackProgress) {
			const progressDistance = (end - this.stageMap.purchase.distance < 0 ?
				(end + this.points.length) - this.stageMap.purchase.distance :
				end - this.stageMap.purchase.distance) * this.length / this.points.length;

			const progressSoFar = this.progressSoFar || 0;

			this.progress.attr('stroke-dasharray',
				`${progressSoFar} ${this.length - (progressSoFar)}`);

			let progressDur;
			if (window.Cypress) {
				progressDur = 5; // speed up animation for cypress runs
			} else {
				progressDur = 2000;
			}

			this.progress.transition()
				.delay(500)
				.duration(progressDur)
				.attr('stroke-dasharray', `${progressDistance} ${this.length - progressDistance}`)
				.on('start', () => {
					if (window.Cypress) {
						window.racetrackEvents.next({ id: 'progressMovingStart' });
					}
				})
				.on('end', () => {
					if (window.Cypress) {
						window.racetrackEvents.next({ id: 'progressMovingEnd' });
					}
				});

			this.progressSoFar = progressDistance;
			this.previewSoFar = 0;
		}
	}

	/**
	 * Does a victory lap, then moves to next stage in sequence
	 *
	 * @param {boolean} trackProgress Should progress bar follow car
	 * @memberof RacetrackComponent
	 */
	public zoomToNext (trackProgress = false) {
		let next = stages.indexOf(this.current) + 1;

		if (next === stages.length) { next = 0; }

		// this.onStageChange.emit(stages[next]);
		this.zoomToStage(stages[next], trackProgress);
	}

	/**
	 * Does a victory lap, then moves to current pitstop
	 * @param trackProgress Should progress bar follo car
	 * @memberof RacetrackComponent
	 */
	public zoomToCurrent (trackProgress = false) {
		let next = stages.indexOf(this.currentStage.toLowerCase());

		if (next === stages.length) { next = 0; }

		// this.onStageChange.emit(stages[next]);
		this.zoomToStage(stages[next], trackProgress);
	}

	/**
	 * Does a victory lap, then moves to previous stage in sequence
	 *
	 * @param {boolean} trackProgress Should progress bar follow car
	 * @memberof RacetrackComponent
	 */
	public zoomToPrevious (trackProgress = false) {
		let prev = stages.indexOf(this.current) - 1;

		if (prev === -1) { prev = stages.length - 1; }

		// this.onStageChange.emit(stages[prev]);
		this.zoomToStage(stages[prev], trackProgress);
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

	/**
	 * Re-render labels
	 */
	private refreshLabels () {
		this.stageLabels.filter(d => (d.name !== this.currentStage.toLowerCase()) &&
			(d.name !== this.current))
			.transition()
			.duration(200)
			.attr('opacity', 0);

		this.stageLabels.filter(d => (d.name === this.currentStage.toLowerCase()) ||
			(d.name === this.current))
			.raise()
			.transition()
			.duration(200)
			.attr('opacity', 1);
	}
}
