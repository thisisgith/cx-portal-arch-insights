import { configureTestSuite } from 'ng-bullet';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPanelComponent } from './details-panel.component';
import { DetailsPanelModule } from './details-panel.module';

/**
 * Wrapper component for testing panel360
 */
@Component({
	template: `
		<details-panel [hidden]="!openPanel"
			[fullscreen]="fullscreen">
			<details-panel-header (close)="openPanel = false"
				[(fullscreen)]="fullscreen">
				<div detailsPanelTitle class="text-xlarge"
					[innerText]="'360 Details Unit Test'">
				</div>
				<div><span>Some stuff goes in the header here</span></div>
				<div><span>And some more...</span></div>
			</details-panel-header>
			<span>Some stuff in the body.</span>
		</details-panel>
	`,
})
class WrapperComponent {
	@ViewChild(DetailsPanelComponent, { static: true }) public panel360: DetailsPanelComponent;
	public openPanel = false;
	public fullscreen = false;
}

describe('DetailsPanelComponent', () => {
	let component: DetailsPanelComponent;
	let fixture: ComponentFixture<WrapperComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [DetailsPanelModule],
		});
	});

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

	it('should handle page clicks', () => {
		const closeDiv = document.createElement('div');
		const notCloseDiv = document.createElement('div');
		notCloseDiv.classList.add('not-close-360');

		// These dummy divs will be cut off in the function
		const dummy = document.createElement('div');
		const dummy2 = document.createElement('div');
		const eventIn = jasmine.createSpyObj('eventIn',
			{
				composedPath: [
					closeDiv,
					notCloseDiv,
					dummy,
					dummy2,
				],
			},
		);

		const eventOut = jasmine.createSpyObj('eventIn',
			{
				composedPath: [
					closeDiv,
					dummy,
					dummy2,
				],
			},
		);

		component.hidden = false;
		component.onPageClick(eventIn);
		expect(component.hidden)
			.toBe(false);

		component.hidden = true;
		component.onPageClick(eventIn);
		expect(component.hidden)
			.toBe(true);

		component.hidden = false;
		component.onPageClick(eventOut);
		expect(component.hidden)
			.toBe(true);

		component.hidden = true;
		component.onPageClick(eventOut);
		expect(component.hidden)
			.toBe(true);
	});
});
