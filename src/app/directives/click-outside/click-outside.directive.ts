import {
	Directive,
	ElementRef,
	HostListener,
	Output,
	EventEmitter,
} from '@angular/core';

@Directive({
	selector: '[appClickOutside]',
})
export class ClickOutsideDirective {

	@Output() public clickOutside = new EventEmitter();

	constructor (private elem: ElementRef) { }

	@HostListener('document:click', ['$event.target'])
	public onClick (e) {
		const isClickedInside = this.elem.nativeElement.contains(e);
		if (!isClickedInside) {
			this.clickOutside.emit(null);
		}
	}
}
