import {
	Directive,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	Renderer2,
	SimpleChanges,
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
	@Output() public collapsed = new EventEmitter();
	@Output() public expanded = new EventEmitter();

	/**
	 * NgOnInit
	 */
	public ngOnInit () {
		if (this.heightTransitionExpanded) {
			this.renderer.setStyle(this.el.nativeElement, 'height', 'auto');
			this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
		} else {
			this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
			this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
			this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
		}
	}

	/**
	 * NgOnChanges
	 * @param changes simple changes
	 */
	public ngOnChanges (changes: SimpleChanges) {
		if (changes.heightTransitionExpanded.isFirstChange()) {
			return;
		}
		const elemHeight = this.el.nativeElement.scrollHeight;
		this.el.nativeElement.style.transition = 'opacity .2s, height .2s';
		if (this.heightTransitionExpanded) {
			this.renderer.setStyle(this.el.nativeElement, 'height', `${elemHeight}px`);
			this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
			this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'auto');
			const unlisten = this.renderer.listen(this.el.nativeElement, 'transitionend', () => {
				this.renderer.setStyle(this.el.nativeElement, 'height', 'auto');
				this.expanded.emit();
				unlisten();
			});
		} else {
			const transition = this.el.nativeElement.style.transition;
			this.renderer.removeStyle(this.el.nativeElement, 'transition');
			this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
			requestAnimationFrame(() => {
				this.renderer.setStyle(this.el.nativeElement, 'height', `${elemHeight}px`);
				this.renderer.setStyle(this.el.nativeElement, 'transition', transition);
				requestAnimationFrame(() => {
					this.renderer.setStyle(this.el.nativeElement, 'height', '0px');
					this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
					const unlisten =
						this.renderer.listen(this.el.nativeElement, 'transitionend', () => {
							this.collapsed.emit();
							unlisten();
						});
				});
			});
		}
	}
}
