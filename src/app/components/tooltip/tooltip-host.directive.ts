import { Directive, ViewContainerRef } from '@angular/core';

/**
 * TooltipHostDirective
 */
@Directive({
	selector: '[tooltip-host]',
})
export class TooltipHostDirective {
	constructor (public viewContainerRef: ViewContainerRef) { }
}
