import {
	ApplicationRef, ComponentFactoryResolver, ComponentRef, Directive,
	EmbeddedViewRef, HostListener, Injector, Input, OnDestroy, TemplateRef,
} from '@angular/core';
import { TooltipComponent } from './tooltip.component';
import { Subscription, timer } from 'rxjs';

import * as _ from 'lodash-es';

/**
 * TooltipComponent
 */
@Directive({
	selector: '[tooltip]',
})
export class TooltipDirective implements OnDestroy {
	public componentRef: ComponentRef<any>;
	public mouseIsOver = false;
	public mouseIsOverTooltip = false;
	public removalDelay = 500;
	public tooltipMouseEnterSub: Subscription;
	public tooltipMouseLeaveSub: Subscription;
	public insertTimeout: Subscription;
	@Input() public tooltipTemplate: TemplateRef<any>;
	@Input() public tooltipComponent: any;
	@Input() public tooltipData: any;
	@Input() public tooltipDelay = 1000;
	@Input() public tooltipMaxHeight;
	@Input() public tooltipMaxWidth;
	/**
	 * Listens for mouseenter
	 */
	@HostListener('mouseenter', ['$event']) public onMouseEnter () {
		this.mouseIsOver = true;
	}
	/**
	 * Listens for mouseleave
	 * @param event - MouseEvent
	 */
	@HostListener('mouseleave', ['$event']) public onMouseLeave () {
		this.mouseIsOver = false;
		timer(this.removalDelay)
			.subscribe(() => {
				if (!this.mouseIsOverTooltip) {
					this.removeTooltip();
				}
			});
	}
	/**
	 * Listens for mousemove
	 * @param event - MouseEvent
	 */
	@HostListener('mousemove', ['$event']) public onMouseMove (event: MouseEvent) {
		this.insertTimeout = timer(this.tooltipDelay)
			.subscribe(() => {
				if (this.mouseIsOver) {
					this.appendTooltipToBody(event);
				}
			});
	}
	constructor (
		private appRef: ApplicationRef,
		private componentFactoryResolver: ComponentFactoryResolver,
		private injector: Injector,
	) { }

	/**
	 * Appends a tooltip to the DOM
	 * @param mouseEvent - MouseEvent
	 */
	public appendTooltipToBody (mouseEvent: MouseEvent) {
		this.removeTooltip();

		// 1. Create a component reference from the component
		this.componentRef = this.componentFactoryResolver
			.resolveComponentFactory(TooltipComponent)
			.create(this.injector);

		if (!_.isNil(this.tooltipTemplate)) {
			this.componentRef.instance.template = this.tooltipTemplate;
		}
		if (!_.isNil(this.tooltipComponent)) {
			this.componentRef.instance.component = this.tooltipComponent;
			if (!_.isNil(this.tooltipData)) {
				this.componentRef.instance.componentData = this.tooltipData;
			}
		}
		this.componentRef.instance.positionX = mouseEvent.clientX + 10;
		this.componentRef.instance.positionY = mouseEvent.clientY;
		this.componentRef.instance.maxHeight = this.tooltipMaxHeight;
		this.componentRef.instance.maxWidth = this.tooltipMaxWidth;
		this.tooltipMouseEnterSub = (<TooltipComponent> this.componentRef.instance)
			.mouseEnterSubject.subscribe(this.setTooltipMouseEnter.bind(this));
		this.tooltipMouseLeaveSub = (<TooltipComponent> this.componentRef.instance)
			.mouseLeaveSubject.subscribe(this.setTooltipMouseLeave.bind(this));

		// 2. Attach component to the appRef so that it's inside the ng component tree
		this.appRef.attachView(this.componentRef.hostView);

		// 3. Get DOM element from component
		const domElem: HTMLElement = (<EmbeddedViewRef<any>> this.componentRef.hostView)
			.rootNodes[0];

		// 4. Append DOM element to the body
		document.body.appendChild(domElem);
	}

	/**
	 * NgOnDestroy
	 */
	public ngOnDestroy () {
		if (!_.isNil(this.insertTimeout)) {
			this.insertTimeout.unsubscribe();
		}
		this.removeTooltip();
	}

	/**
	 * Removes the tooltip from the DOM
	 */
	public removeTooltip () {
		_.invoke(this, 'tooltipMouseEnterSub.unsubscribe');
		_.invoke(this, 'tooltipMouseLeaveSub.unsubscribe');
		if (!_.isNil(this.componentRef)) {
			this.appRef.detachView(this.componentRef.hostView);
			this.componentRef.destroy();
		}
	}

	/**
	 * Set flag for tooltip to remain open when mouse is over
	 */
	public setTooltipMouseEnter () {
		this.mouseIsOverTooltip = true;
	}

	/**
	 * Set flag that mouse is no longer over the tooltip
	 */
	public setTooltipMouseLeave () {
		this.mouseIsOverTooltip = false;
		this.onMouseLeave();
	}
}
