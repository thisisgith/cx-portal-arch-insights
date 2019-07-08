import { Component, ViewChild } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { Panel360Module } from '../panel360.module';
import { Panel360HeaderComponent } from './panel360-header.component';

/**
 * Wrapper component for testing panel360 Header
 */
@Component({
	template: `
		<app-panel360 [hidden]="!openPanel"
			[fullscreen]="fullscreen">
			<app-panel360-header (close)="openPanel = false"
				[(fullscreen)]="fullscreen">
				<div appPanel360Title class="text-xlarge"
					[innerText]="'360 Details Unit Test'">
				</div>
			</app-panel360-header>
		</app-panel360>
	`,
})
class WrapperComponent {
	@ViewChild(Panel360HeaderComponent, { static: true }) public header:
		Panel360HeaderComponent;
	public openPanel = false;
	public fullscreen = false;
}

describe('Panel360HeaderComponent', () => {
	let component: Panel360HeaderComponent;
	let fixture: ComponentFixture<WrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WrapperComponent],
			imports: [Panel360Module],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		component = fixture.componentInstance.header;
		spyOn(component.close, 'emit');
		spyOn(component.fullscreenChange, 'emit');
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit a fullscreen event', fakeAsync(() => {
		const button = fixture.debugElement.query(
			By.css('[data-auto-id="asset-details-toggle-fullscreen-icon"]'),
		);
		button.triggerEventHandler('click', null);
		tick();
		fixture.detectChanges();
		expect(component.fullscreenChange.emit)
			.toHaveBeenCalledWith(true);
	}));

	it('should emit a close event', fakeAsync(() => {
		const button = fixture.debugElement.query(By.css('[data-auto-id="CloseDetails"]'));
		button.triggerEventHandler('click', null);
		tick();
		fixture.detectChanges();
		expect(component.close.emit)
			.toHaveBeenCalledWith(true);
	}));
});
