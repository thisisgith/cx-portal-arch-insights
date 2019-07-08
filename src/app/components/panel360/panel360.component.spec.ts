import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Panel360Component } from './panel360.component';
import { Panel360Module } from './panel360.module';

/**
 * Wrapper component for testing panel360
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
				<div><span>Some stuff goes in the header here</span></div>
				<div><span>And some more...</span></div>
			</app-panel360-header>
			<span>Some stuff in the body.</span>
		</app-panel360>
	`,
})
class WrapperComponent {
	@ViewChild(Panel360Component, { static: true }) public panel360: Panel360Component;
	public openPanel = false;
	public fullscreen = false;
}

describe('Panel360Component', () => {
	let component: Panel360Component;
	let fixture: ComponentFixture<WrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [Panel360Module],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		component = fixture.componentInstance.panel360;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should have a header', () => {
		expect(component.headerComponent.content)
			.toBeTruthy();
	});
});
