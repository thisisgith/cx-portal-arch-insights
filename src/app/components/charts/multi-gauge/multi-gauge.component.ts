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
import { arc, line } from 'd3-shape';
import { transition } from 'd3-transition';
import { isEqual } from 'lodash/core';

/**
 * Bind methods to d3
 */
const d3 = { format, select, arc, line, transition, interpolate };

/**
 * expected format of input
 */
interface GaugeDatum {
	percentage: number;
	label: string;
}

/**
 * Main gauge component
 */
@Component({
	selector: 'app-multi-gauge',
	styleUrls: ['./multi-gauge.component.scss'],
	templateUrl: './multi-gauge.component.html',
})
export class MultiGaugeComponent implements OnInit, OnChanges {
	@Input() private data: GaugeDatum[];
	@Input() private width?: number;
	@Input() private height?: number;
	@Input() private arcColor?: string = null;
	@Input() private idx = 0; // active index (PR, FN, bugs)
	@Input() private selected = false;
	@ViewChild('multigaugeSvg', { static: true }) public gaugeSvg: ElementRef;

	private svg: SVGElement;
	private meter: SVGElement;
	private previousPercentages = [];
	private initialized = false;
	private readonly twoPi = 2 * Math.PI;

	/**
	 * Calls drawGauge on initialization
	 */
	public ngOnInit (): void {
		this.width = this.width || 300;
		this.height = this.height || 96;

		this.svg = d3.select(this.gaugeSvg.nativeElement)
			.attr('width', this.width)
			.attr('height', this.height)
			.append('g')
			.attr('transform', `translate(${this.width / 3}, ${this.height / 2})`);

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
		if (this.initialized && (
			changes.selected ||
			changes.idx ||
			!isEqual(changes.data.currentValue, changes.data.previousValue)
		)) {
			this.drawGauge();
		}
	}

	/**
	 * Draws gauge using d3
	 */
	private drawGauge (): void {
		this.data.forEach((_, i) => this.previousPercentages[i] = this.previousPercentages[i] || 0);

		const gauges = [];
		this.data.forEach((_, i) => {
			gauges.push(d3.arc()
				.startAngle(0)
				.innerRadius(Math.floor(this.height / 2) - 6 - (6 * i * 2))
				.outerRadius(Math.floor(this.height / 2) - (6 * i * 2))
				.cornerRadius(10));
		});

		const path = this.meter.selectAll('.background')
			.data(this.data);

		path.enter()
			.append('path')
			.classed('background', true)
			.attr('fill', '#e4f0f1')
			.merge(path)
			.attr('d', (_, i) => gauges[i].endAngle(this.twoPi)());

		const foreground = this.meter.selectAll('.foreground')
			.data(this.data);

		foreground.enter()
			.append('path')
			.classed('foreground', true)
			.merge(foreground)
			.attr('d', (d, i) => gauges[i].endAngle(this.twoPi * d.percentage / 100)())
			.attr('fill', (_, i) => i === this.idx && this.selected ?
				'#00bceb' : this.arcColor || '#7dd2f4');

		this.meter.selectAll('.value')
			.remove();

		const value = this.meter.selectAll('.value')
			.data(this.data);

		const valuesEnter = value.enter()
			.append('g')
			.classed('value', true)
			.attr('transform', (_, i) => {
				const offset = i === 1 ? 4 : 0;

				return `translate(${this.height / 2 + 10},
					${-(this.height / 2) + (i * 23) + offset})`;
			})
			.append('foreignObject')
			.attr('width', 100)
			.attr('height', d => d.label.length > 15 ? 25 : 20)
			.append('xhtml:div')
			.style('display', 'flex')
			.style('align-items', 'center')
			.style('justify-content', 'space-between');

		valuesEnter.append('div')
			.style('font-family', 'CiscoSans')
			.style('font-weight', '400')
			.style('line-height', d => d.label.length > 15 ? '12px' : '20px')
			.style('color', (_, i) => i === this.idx && this.selected ? '#00bceb' : '#6c757d')
			.style('font-size', '12px')
			.text(d => d.label.includes('Critical') ? 'Bugs' : d.label);

		valuesEnter.append('div')
			.style('font-family', 'CiscoSans')
			.style('font-weight', '300')
			.style('line-height', d => d.label.length > 15 ? '25px' : '20px')
			.style('letter-spacing', '0.72px')
			.style('color', (_, i) => i === this.idx && this.selected ? '#00bceb' : '#243034')
			.style('font-size', '15px')
			.text(d => d3.format('.0f')(d.percentage));

		const lineGenerator = d3.line();

		this.svg.selectAll('.label-circle')
			.remove();

		this.svg.selectAll('.label-line')
			.remove();

		const linesEnter = this.svg.selectAll('.label-line')
			.data(this.data)
			.enter();

		linesEnter.append('path')
			.classed('label-line', true)
			.attr('stroke', (_, i) => i === this.idx && this.selected ? '#00bceb' : '#88b6bc')
			.attr('stroke-width', 0.5)
			.attr('opacity', (_, i) => i === this.idx && this.selected ? 1 : 0.5)
			.attr('d', (_, i) => {
				// midpoint of inner and outer radii
				const r = Math.floor(this.height / 2) - 3 - (6 * i * 2);
				// height of label
				const offset = i === 1 ? 4 : 0;
				const y = -(this.height / 2) + (i * 23) + 10 + offset;
				// point on a circle formula: x^2 + y^2 = r^2
				const x1 = Math.sqrt(Math.pow(r, 2) - Math.pow(y, 2));
				// x of label
				const x2 = this.height / 2 + 7;

				return lineGenerator([
					[x1, y],
					[x2, y],
				]);
			});

		linesEnter.append('circle')
			.classed('label-circle', true)
			.attr('r', 1.5)
			.attr('fill', (_, i) => i === this.idx && this.selected ? '#017cad' : '#88b6bc')
			.attr('cx', (_, i) => {
				// midpoint of inner and outer radii
				const r = Math.floor(this.height / 2) - 3 - (6 * i * 2);
				// height of label
				const offset = i === 1 ? 4 : 0;
				const y = -(this.height / 2) + (i * 23) + 10 + offset;

				// point on a circle formula: x^2 + y^2 = r^2
				return Math.sqrt(Math.pow(r, 2) - Math.pow(y, 2));
			})
			.attr('cy', (_, i) => {
				const offset = i === 1 ? 4 : 0;

				return -(this.height / 2) + (i * 23) + 10 + offset;
			});

		/* tslint:disable no-this-assignment */
		const self = this;

		this.svg.selectAll('.foreground')
			.each(function (d, i) {
				const interpolator = d3.interpolate(self.previousPercentages[i] / 100,
					d.percentage / 100);

				let progress = 0;
				const foregroundEl = d3.select(this);

				foregroundEl.transition()
					.duration(this.initialized ? 300 : 1000)
					.tween('progress', () => (t: Number) => {
						progress = interpolator(t);
						foregroundEl.attr('d', gauges[i].endAngle(self.twoPi * progress));
					})
					.on('end', () => self.previousPercentages[i] = d.percentage);
			});

		this.initialized = true;
	}
}
