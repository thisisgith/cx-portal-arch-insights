import { Component, ViewChild } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DetailsPanelModule } from '../details-panel.module';
import { DetailsPanelHeaderComponent } from './header.component';

/**
 * Wrapper component for testing panel360 Header
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
			</details-panel-header>
		</details-panel>
	`,
})
class WrapperComponent {
	@ViewChild(DetailsPanelHeaderComponent, { static: true })
		public header: DetailsPanelHeaderComponent;
	public openPanel = false;
	public fullscreen = false;
}

describe('DetailsPanelHeaderComponent', () => {
	let component: DetailsPanelHeaderComponent;
	let fixture: ComponentFixture<WrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WrapperComponent],
			imports: [DetailsPanelModule],
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
