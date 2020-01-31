import { configureTestSuite } from 'ng-bullet';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSelectComponent } from './panel-select.component';
import { PanelSelectModule } from './panel-select.module';

/**
 * Wrapper Component for testing
 */
@Component({
	template: `
		<form [formGroup]="testForm">
			<panel-select formControlName="severity">
				<ng-container *ngFor="let option of sevOptions">
					<panel-select-option [value]="option.value">
						<div class="half-margin-bottom">
							<span [innerText]="option.name"></span>
						</div>
					</panel-select-option>
				</ng-container>
			</panel-select>
		</form>
	`,
})
class WrapperComponent {
	@ViewChild(PanelSelectComponent, { static: true }) public panelSelect: PanelSelectComponent;

	public testForm = new FormGroup({
		severity: new FormControl(''),
	});

	public sevOptions = [
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

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [WrapperComponent],
			imports: [
				ReactiveFormsModule,
				PanelSelectModule,
			],
		});
	});

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
		jest.spyOn(component, 'writeValue');
		wrapperComponent.testForm.controls.severity.setValue(3);
		expect(component.writeValue)
			.toHaveBeenCalled();
	});

	it('should have 4 options', () => {
		expect(component.options.length)
			.toEqual(4);
	});

	it('should select on click', fakeAsync(() => {
		jest.spyOn(component, 'onChange');
		const panel = fixture.debugElement.queryAll(By.css('a'))[1];
		panel.nativeElement.click();
		tick();
		expect(component.onChange)
			.toHaveBeenCalledWith(2);
	}));

});
