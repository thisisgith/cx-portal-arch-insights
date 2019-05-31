import {
	Directive,
	ElementRef,
	Input,
	OnChanges,
	OnInit,
	Renderer2,
} from '@angular/core';

/**
 * Adds a height transition to toggled elements programatically
 */
@Directive({
	selector: '[heightTransition]',
})
export class HeightTransitionDirective implements OnChanges, OnInit {

	constructor (
		private el: ElementRef,
		private renderer: Renderer2,
	) { }

	@Input() private heightTransitionExpanded: boolean;

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		if (this.heightTransitionExpanded) {
			this.renderer.setStyle(this.el.nativeElement, 'height', 'auto');
		} else {
			this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
		}
		this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
	}

	/**
	 * NgOnChanges
	 */
	public ngOnChanges () {
		const elemHeight = this.el.nativeElement.scrollHeight;
		this.el.nativeElement.style.transition = 'opacity .2s, height .2s';
		if (this.heightTransitionExpanded) {
			this.renderer.setStyle(this.el.nativeElement, 'height', `${elemHeight}px`);
			this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
			const unlisten = this.renderer.listen(this.el.nativeElement, 'transitionend', () => {
				unlisten();
				this.renderer.removeStyle(this.el.nativeElement, 'height');
			});
		} else {
			const transition = this.el.nativeElement.style.transition;
			this.renderer.removeStyle(this.el.nativeElement, 'transition');
			requestAnimationFrame(() => {
				this.renderer.setStyle(this.el.nativeElement, 'height', `${elemHeight}px`);
				this.renderer.setStyle(this.el.nativeElement, 'transition', transition);
				requestAnimationFrame(() => {
					this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
					this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
				});
			});
		}
	}
}
