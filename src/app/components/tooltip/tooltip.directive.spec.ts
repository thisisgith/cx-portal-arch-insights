import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TooltipModule } from './tooltip.module';

/**
 * Test Component
 */
@Component({
	template: '<div>Test</div> ',
})
class TestTooltip {
}

/**
 * Test Component
 */
@Component({
	template: '<div ' +
		'id="target" ' +
		'tooltip ' +
		'[tooltipTemplate]="calendarCellTooltip" ' +
		'[tooltipData]="cell" ' +
		'tooltipDelay="500" ' +
	'>Test</div>' +
	'<ng-template #calendarCellTooltip><span id="tooltip">Tooltip</span></ng-template>',
})
class TestTooltipTemplateContainer {
	public cell = { test: true };
}

/**
 * Test Component
 */
@Component({
	template: '<div ' +
		'id="target" ' +
		'tooltip ' +
		'[tooltipComponent]="calendarCellTooltip" ' +
		'[tooltipData]="cell" ' +
		'tooltipDelay="500" ' +
	'>Test</div>',
})
class TestTooltipComponentContainer {
	public cell = { test: true };
	public calendarCellTooltip = TestTooltip;
}

/**
 * Tooltip Test Module
 */
@NgModule({
	declarations: [
		TestTooltip,
		TestTooltipComponentContainer,
		TestTooltipTemplateContainer,
	],
	entryComponents: [TestTooltip],
	exports: [
		TestTooltip,
		TestTooltipComponentContainer,
		TestTooltipTemplateContainer,
	],
	imports: [TooltipModule],
})
class TooltipTestModule { }

describe('TooltipDirective', () => {
	let component: TestTooltip;
	let fixture1: ComponentFixture<TestTooltipTemplateContainer>;
	let fixture2: ComponentFixture<TestTooltipComponentContainer>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [TooltipTestModule],
		});
	}));

	describe('with template', () => {
		beforeEach(() => {
			fixture1 = TestBed.createComponent(TestTooltipTemplateContainer);
			component = fixture1.componentInstance;

			fixture1.detectChanges();
		});

		it('should create', () => {
			expect(component)
				.toBeTruthy();
		});

		it('should show and hide tooltip', fakeAsync(() => {
			const directiveHost = fixture1.debugElement.query(By.css('#target'));

			let event = new Event('mouseenter');
			directiveHost.nativeElement.dispatchEvent(event);
			event = new Event('mousemove');
			directiveHost.nativeElement.dispatchEvent(event);
			tick(1000);
			fixture1.detectChanges();

			let tooltip = document.getElementById('tooltip');
			expect(tooltip)
				.toBeDefined();

			event = new Event('mouseleave');
			directiveHost.nativeElement.dispatchEvent(event);
			tick(1000);
			fixture1.detectChanges();

			tooltip = document.getElementById('tooltip');
			expect(tooltip)
				.toBeNull();
		}));

		it('should set mouseenter and mouseleave flags', fakeAsync(() => {
			const directiveHost = fixture1.debugElement.query(By.css('#target'));

			let event = new Event('mouseenter');
			directiveHost.nativeElement.dispatchEvent(event);
			event = new Event('mousemove');
			directiveHost.nativeElement.dispatchEvent(event);
			tick(1000);
			fixture1.detectChanges();

			let tooltip = document.getElementById('tooltip');
			tooltip.dispatchEvent(event);

			event = new Event('mouseleave');
			tooltip.dispatchEvent(event);
			tooltip = document.getElementById('tooltip');

			directiveHost.nativeElement.dispatchEvent(event);
			tick(1000);
			fixture1.detectChanges();

			tooltip = document.getElementById('tooltip');

			expect(tooltip)
				.toBeNull();
		}));
	});

	describe('with component', () => {
		beforeEach(() => {
			fixture2 = TestBed.createComponent(TestTooltipComponentContainer);
			component = fixture2.componentInstance;

			fixture2.detectChanges();
		});

		it('should show and hide tooltip', fakeAsync(() => {
			const directiveHost = fixture2.debugElement.query(By.css('#target'));

			let event = new Event('mouseenter');
			directiveHost.nativeElement.dispatchEvent(event);
			event = new Event('mousemove');
			directiveHost.nativeElement.dispatchEvent(event);
			tick(1000);
			fixture2.detectChanges();

			let tooltip = document.getElementById('tooltip');
			expect(tooltip)
				.toBeDefined();

			event = new Event('mouseleave');
			directiveHost.nativeElement.dispatchEvent(event);
			tick(1000);
			fixture2.detectChanges();

			tooltip = document.getElementById('tooltip');
			expect(tooltip)
				.toBeNull();
		}));
	});
});
