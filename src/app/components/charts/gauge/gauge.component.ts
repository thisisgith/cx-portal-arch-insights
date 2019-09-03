import {
	Component,
	Input,
	OnInit,
	OnChanges,
	ViewChild,
	ElementRef,
	SimpleChanges,
} from '@angular/core';
import { format } from 'd3-format';
import { interpolate } from 'd3-interpolate';
import { select, SVGElement } from 'd3-selection';
import { arc } from 'd3-shape';
import { easeLinear } from 'd3-ease';
import { transition, active } from 'd3-transition';

/**
 * Bind methods to d3
 */
const d3 = { format, select, arc, transition, active, easeLinear, interpolate };

/**
 * Main gauge component
 */
@Component({
	selector: 'app-gauge',
	templateUrl: './gauge.component.html',
})
export class GaugeComponent implements OnInit, OnChanges {
	@Input() private percentage: number;
	@Input() private width?: number;
	@Input() private textColor?: string = null;
	@Input() private arcColor?: string = null;
	@Input() private label?: string = null;
	@Input() private collecting?: Boolean = false;
	@ViewChild('gaugeSvg', { static: true }) public gaugeSvg: ElementRef;

	private svg: SVGElement;
	private meter: SVGElement;
	private previousPercentage = 0;
	private initialized = false;
	private height: number;
	private readonly twoPi = 2 * Math.PI;

	/**
	 * Calls drawGauge on initialization
	 */
	public ngOnInit (): void {
		this.width = this.width || 96;
		this.height = this.width || 96;

		this.svg = d3.select(this.gaugeSvg.nativeElement)
			.attr('width', this.width + (this.label ? 120 : 0))
			.attr('height', this.height)
			.attr('overflow', 'visible')
			.append('g')
			.attr('transform', `translate(${(this.width / 2) + (this.label ? 60 : 0)},
				${this.height / 2})`);

		this.meter = this.svg.append('g')
			.attr('class', 'gauge');

		this.drawGauge();
	}

	/**
	 * Updates fill color if input property changes
	 *
	 * @param {SimpleChanges} changes Object of previous and current values
	 */
	public ngOnChanges (changes: SimpleChanges): void {
		if (changes.percentage && changes.percentage.previousValue) {
			this.previousPercentage = changes.percentage.previousValue;
		}
		if (this.initialized && (changes.percentage || changes.arcColor)) {
			this.drawGauge();
		}
		if (changes.collecting && !changes.collecting.firstChange) {
			this.drawGauge();
		}
	}

	/**
	 * Draws gauge using d3
	 */
	private drawGauge (): void {
		/* tslint:disable no-this-assignment */
		const self = this;

		const gauge = d3.arc()
			.startAngle(0)
			.innerRadius(Math.floor(this.width / 2) - 6)
			.outerRadius(Math.floor(this.width / 2))
			.cornerRadius(10);

		const path = this.meter.selectAll('.background')
			.data([{ }]);

		path.enter()
			.append('path')
			.classed('background', true)
			.attr('fill', '#e4f0f1')
			.merge(path)
			.attr('d', gauge.endAngle(this.twoPi));

		const foreground = this.meter.selectAll('.foreground')
			.data([{ }]);

		foreground.enter()
			.append('path')
			.classed('foreground', true)
			.merge(foreground)
			.attr('d', gauge.endAngle(this.twoPi * this.percentage / 100))
			.attr('fill', this.arcColor || '#7dd2f4');

		const collectingIndicator = this.meter.selectAll('.collectingIndicator')
			.data([{ }]);

		if (this.collecting === true) {
			collectingIndicator.enter()
			.append('circle')
			.attr('r', (this.width / 2) - 3)
			.attr('fill', 'none')
			.classed('collectingIndicator', true)
			.attr('stroke', this.arcColor)
			.attr('stroke-width', 6)
			.attr('stroke-dasharray', function () {
				const length = this.getTotalLength();

				return `40 ${length - 40}`;
			})
			.attr('stroke-dashoffset', function () {
				return this.getTotalLength();
			})
			.transition()
				.ease(d3.easeLinear)
				.on('start', function repeat () {
					d3.active(this)
						.duration(2000)
						.attr('stroke-dashoffset', 0)
					.on('end', function () {
						d3.select(this)
							.attr('stroke-dashoffset', function () {
								return this.getTotalLength();
							});
					})
					.transition()
						.on('start', repeat);
				});

			this.meter.select('.collectingIndicator')
				.raise();

			this.meter.select('.foreground')
				.lower();
		} else {
			this.meter.select('.foreground')
				.raise();

			this.meter.select('.collectingIndicator')
				.remove();
		}

		this.meter.selectAll('.value')
			.remove();
		this.meter.selectAll('.percent')
			.remove();

		const value = this.meter.selectAll('.value')
			.data([{ }]);

		const percent = this.meter.selectAll('.percent')
			.data([{ }]);

		value.enter()
			.append('text')
			.classed('value', true)
			.merge(value)
			.attr('text-anchor', 'middle')
			.attr('align-baseline', 'central')
			.attr('color', this.textColor)
			.attr('font-family', 'CiscoSans')
			.attr('font-weight', '300')
			.attr('line-height', '19px')
			.attr('letter-spacing', '0.72px')
			.attr('fill', this.textColor || '#afdff2')
			.attr('font-size', () => self.collecting ? '10px' : '36px')
			.text(() => self.collecting ? 'Collecting...' : d3.format('.0f')(this.percentage))
			.attr('transform', () => self.collecting ?
				'translate(0, 5)' :
				/* tslint:disable-next-line trailing-comma */
				`translate(${this.percentage > 99.5 ? -7 : this.percentage >= 10 ? -5 : -2}, 10)`
			);

		percent.enter()
			.append('text')
			.classed('percent', true)
			.merge(percent)
			.text(() => self.collecting ? '' : '%')
			.attr('color', this.textColor)
			.attr('font-family', 'CiscoSans')
			.attr('font-weight', '300')
			.attr('line-height', '12px')
			.attr('letter-spacing', '0.72px')
			.attr('fill', this.textColor || '#afdff2')
			.attr('font-size', '14px')
			.attr('transform', `translate(${
				this.percentage > 99.5 ? 26 :
				this.percentage >= 10 ? 18 : 11}, 10)`);

		if (this.label) {
			this.svg.selectAll('.gauge-label')
				.data([this.label])
				.enter()
				.append('foreignObject')
					.classed('gauge-label', true)
					.attr('width', '80px')
					.attr('height', this.height)
					.attr('x', (this.width / 2) + 10)
					.attr('y', -(this.height / 2))
				.append('xhtml:div')
					.text(this.label)
					.style('display', 'flex')
					.style('align-items', 'center')
					.style('height', '100%')
					.style('color', '#6c757d')
					.style('font-size', '12px')
					.style('font-weight', '400')
					.style('line-height', '14px');
		}

		const i = d3.interpolate(this.previousPercentage / 100, this.percentage / 100);

		let progress = 0;
		const valueEl = this.svg.select('.value');
		const foregroundEl = this.svg.select('.foreground');

		if (!this.collecting) {
			this.svg.transition()
				.duration(this.initialized ? 300 : 1000)
				.tween('progress', () => (t: Number) => {
					progress = i(t);
					valueEl.text(d3.format('.0f')(progress * 100));
					foregroundEl.attr('d', gauge.endAngle(this.twoPi * progress));
				})
				.on('end', () => this.previousPercentage = this.percentage);
		}

		this.initialized = true;
	}
}
