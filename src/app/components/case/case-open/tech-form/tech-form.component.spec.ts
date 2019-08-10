import { Component, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CaseService } from '@cui-x/services';

import { TechFormComponent } from './tech-form.component';
import { TechFormModule } from './tech-form.module';
import { CaseRequestType } from '@classes';

/**
 * Wrapper Component for testing
 */
@Component({
	template: `
		<form [formGroup]="testForm">
			<tech-form [requestRma]="requestRma"></tech-form>
		</form>
	`,
})
class WrapperComponent {
	@ViewChild(TechFormComponent, { static: true }) public techFormComponent: TechFormComponent;

	public requestRma = false;
	public testForm = new FormGroup({ });
}

describe('TechFormComponent', () => {
	let wrapperComponent: WrapperComponent;
	let component: TechFormComponent;
	let caseService: CaseService;
	let fixture: ComponentFixture<WrapperComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [WrapperComponent],
			imports: [
				HttpClientTestingModule,
				ReactiveFormsModule,

				TechFormModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		caseService = TestBed.get(CaseService);
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = fixture.componentInstance.techFormComponent;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh problemArea options on RMA change', fakeAsync(() => {
		spyOn(caseService, 'fetchProblemArea')
			.and
			.returnValue(
				of(null),
			);
		wrapperComponent.requestRma = true;
		fixture.detectChanges();
		tick();
		expect(caseService.fetchProblemArea)
			.toHaveBeenCalledWith(CaseRequestType.RMA);
	}));

	it('should refresh subtech options on tech change', fakeAsync(() => {
		spyOn(caseService, 'fetchSubTechList')
			.and
			.returnValue(
				of({ subTechList: [] }),
			);
		component.form.controls.technology.setValue('New Tech Value!');
		tick();
		expect(caseService.fetchSubTechList)
			.toHaveBeenCalled();
	}));

	it('should refresh problemArea options on Subtech change', fakeAsync(() => {
		spyOn(caseService, 'fetchProblemArea')
			.and
			.returnValue(
				of({ problemArea: { customerActivities: [] } }),
			);
		component.form.controls.subtech.setValue('New Subtech Value!');
		tick();
		expect(caseService.fetchProblemArea)
			.toHaveBeenCalled();
	}));
});
