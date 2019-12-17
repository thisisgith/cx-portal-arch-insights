import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { Component } from '@angular/core';

import { ClickOutsideDirective } from './click-outside.directive';
import { configureTestSuite } from 'ng-bullet';

@Component({
	template: `<div (clickOutside)='onClick($event)' appClickOutside> Click Outside this </div>
		<button>This is outside<button>`,
})
class TestClickOutsideComponent {

	public active = false;

	public onClick () {
		this.active = !this.active;
	}

}

describe('ClickOutsideDirective', () => {
	let fixture: ComponentFixture<any>;
	let component: TestClickOutsideComponent;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				TestClickOutsideComponent,
				ClickOutsideDirective,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TestClickOutsideComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create an component', () => {
		expect(component)
			.toBeDefined();
	});

	it('it should not call onClick method when clicked on the div element', async(() => {
		const activeValueBeforeClick = component.active;
		const debugEl: HTMLElement = fixture.debugElement.nativeElement;
		const div: HTMLElement = debugEl.querySelector('div');
		div.click();
		fixture.detectChanges();
		expect(activeValueBeforeClick)
		.toBe(component.active);
	}));

	it('it should  call onClick method when clicked on the button element', async(() => {
		const activeValueBeforeClick = component.active;
		const debugEl: HTMLElement = fixture.debugElement.nativeElement;
		const div: HTMLElement = debugEl.querySelector('button');
		div.click();
		fixture.detectChanges();
		expect(activeValueBeforeClick)
		.toBe(!component.active);
	}));

});
