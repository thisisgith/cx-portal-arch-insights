import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSelectComponent, SelectOption } from './panel-select.component';
import { PanelSelectModule } from './panel-select.module';

/**
 * Wrapper Component for testing
 */
@Component({
	template: `
		<form [formGroup]="testForm">
			<app-panel-select formControlName="severity"
				[options]="sevOptions">
			</app-panel-select>
		</form>
	`,
})
class WrapperComponent {
	@ViewChild(PanelSelectComponent, { static: true }) public panelSelect: PanelSelectComponent;

	public testForm = new FormGroup({
		severity: new FormControl(''),
	});

	public sevOptions: SelectOption<number>[] = [
		{
			name: 'Test 1',
			subtitle: 'Test Subtitle 1',
			value: 1,
		},
		{
			name: 'Test 2',
			subtitle: 'Test Subtitle 2',
			value: 2,
		},
		{
			name: 'Test 3',
			subtitle: 'Test Subtitle 3',
			value: 3,
		},
		{
			name: 'Test 4',
			subtitle: 'Test Subtitle 4',
			value: 4,
		},
	];
}

describe('PanelSelectComponent', () => {
	let component: PanelSelectComponent;
	let wrapperComponent: WrapperComponent;
	let fixture: ComponentFixture<WrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WrapperComponent],
			imports: [
				ReactiveFormsModule,
				PanelSelectModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = fixture.componentInstance.panelSelect;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should register onChange', () => {
		expect(component.onChange)
			.toBeTruthy();
	});

	it('should write value', () => {
		spyOn(component, 'writeValue');
		wrapperComponent.testForm.controls.severity.setValue(3);
		expect(component.writeValue)
			.toHaveBeenCalled();
	});

	it('should select on click', fakeAsync(() => {
		spyOn(component, 'onChange');
		const panel = fixture.debugElement.queryAll(By.css('a'))[1];
		panel.nativeElement.click();
		tick();
		expect(component.onChange)
			.toHaveBeenCalledWith(2);
	}));
});
