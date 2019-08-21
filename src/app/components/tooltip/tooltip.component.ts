import {
	AfterViewInit,
	ChangeDetectorRef,
	Component,
	ComponentFactoryResolver,
	ElementRef,
	HostListener,
	Input,
	TemplateRef,
	ViewChild,
	AfterContentInit,
} from '@angular/core';
import { TooltipHostDirective } from './tooltip-host.directive';
import { Subject } from 'rxjs';

import * as _ from 'lodash-es';

/**
 * TooltipComponent
 */
@Component({
	selector: 'tooltip',
	styleUrls: ['./tooltip.component.scss'],
	templateUrl: './tooltip.component.html',
})
export class TooltipComponent implements AfterViewInit, AfterContentInit {
	@Input() public template: TemplateRef<any>;
	@Input() public component: any;
	@Input() public componentData: any;
	@Input() public positionX: number;
	@Input() public positionY: number;
	@Input() public maxHeight: number;
	@Input() public maxWidth: number;
	@ViewChild(TooltipHostDirective, { static: false }) public tooltipHost: TooltipHostDirective;
	@ViewChild('tooltipContainer', { static: true }) public tooltip: ElementRef;
	public mouseEnterSubject: Subject<MouseEvent> = new Subject<MouseEvent>();
	public mouseLeaveSubject: Subject<MouseEvent> = new Subject<MouseEvent>();
	public OFFSET = 20;
	/**
	 * Listens for mouseenter
	 * @param event - MouseEvent
	 */
	@HostListener('mouseenter', ['$event']) public onMouseEnter (event: MouseEvent) {
		this.mouseEnterSubject.next(event);
	}
	/**
	 * Listens for mouseenter
	 * @param event - MouseEvent
	 */
	@HostListener('mouseleave', ['$event']) public onMouseLeave (event: MouseEvent) {
		this.mouseLeaveSubject.next(event);
	}

	constructor (
		private cdr: ChangeDetectorRef,
		private componentFactoryResolver: ComponentFactoryResolver,
	) { }

	/**
	 * Dynamically loads a component for the tooltip
	 */
	public loadComponent () {
		const componentFactory = this.componentFactoryResolver
			.resolveComponentFactory(this.component);

		const viewContainerRef = this.tooltipHost.viewContainerRef;
		viewContainerRef.clear();

		const componentRef = viewContainerRef.createComponent(componentFactory);
		if (!_.isNil(this.componentData)) {
			(<any> componentRef.instance).data = this.componentData;
		}
		this.cdr.detectChanges();
		this.checkForOverflow();
	}

	/**
	 * NgAfterContentInit
	 */
	public ngAfterContentInit () {
		if (window.innerWidth - this.positionX < +this.maxWidth) {
			this.positionX = window.innerWidth - this.maxWidth + this.OFFSET;
		}
	}

	/**
	 * NgAfterViewInit
	 */
	public ngAfterViewInit () {
		if (!_.isNil(this.component)) {
			// Promise gets around an error thrown by angular for creating a view within a
			// lifecycle hook.
			Promise.resolve()
				.then(() => {
					this.loadComponent();
				});
		}
	}

	/**
	 * Checks if tooltip goes off screen and moves it if so
	 * (tooltip content must have min-width defined**)
	 */
	public checkForOverflow () {
		const tooltipWidth = this.tooltip.nativeElement.clientWidth;
		const tooltipHeight = this.tooltip.nativeElement.clientHeight;
		const totalWidth = tooltipWidth + this.positionX;
		const totalHeight = tooltipHeight + this.positionY;
		if (totalWidth >= window.innerWidth) {
			// corrects overflow for right side of the page
			this.positionX = this.positionX - tooltipWidth - this.OFFSET;
		}
		if (totalHeight >= window.innerHeight) {
			// corrects overflow for bottom of the page
			this.positionY = this.positionY - tooltipHeight - this.OFFSET;
		}
	}
}
