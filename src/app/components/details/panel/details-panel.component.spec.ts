import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [DetailsPanelModule],
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
