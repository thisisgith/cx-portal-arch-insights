import { configureTestSuite } from 'ng-bullet';
import { Component, ViewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CaseService } from '@cui-x/services';

import { TechFormComponent } from './tech-form.component';
import { TechFormModule } from './tech-form.module';
import { CaseRequestType } from '@classes';
import { By } from '@angular/platform-browser';

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

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [WrapperComponent],
			imports: [
				HttpClientTestingModule,
				ReactiveFormsModule,

				TechFormModule,
			],
		});
	});

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
		jest.spyOn(caseService, 'fetchProblemArea')
			.mockReturnValue(
				of(null),
			);
		wrapperComponent.requestRma = true;
		fixture.detectChanges();
		tick();
		expect(caseService.fetchProblemArea)
			.toHaveBeenCalledWith(CaseRequestType.RMA);
	}));

	it('should refresh subtech options on tech change', fakeAsync(() => {
		jest.spyOn(caseService, 'fetchSubTechList')
			.mockReturnValue(
				of({ subTechList: [] }),
			);
		component.form.controls.technology.setValue('New Tech Value!');
		tick();
		expect(caseService.fetchSubTechList)
			.toHaveBeenCalled();
	}));

	it('should refresh problemArea options on Subtech change', fakeAsync(() => {
		jest.spyOn(caseService, 'fetchProblemArea')
			.mockReturnValue(
				of({ problemArea: { customerActivities: [] } }),
			);
		component.form.controls.subtech.setValue('New Subtech Value!');
		tick();
		expect(caseService.fetchProblemArea)
			.toHaveBeenCalled();
	}));

	it('should refresh suggestions when called', fakeAsync(() => {
		jest.spyOn(caseService, 'fetchClassification')
			.mockReturnValue(
				of({
					locatorId: '01fbb089ed4',
					prcode_time: 44,
					predictions: [
						{
							sub_tech: {
								id: '1941',
								name: 'Adaptive Security Appliance (ASA) non-VPN problem',
								probab: 0.482,
							},
							tech: {
								id: '54',
								name:
								'Security - Network Firewalls and Intrusion Prevention Systems',
								probab: 0.482,
							},
						},
					],
					problem_code: ['Interop'],
					Status: 'success',
					subtech_time: 10,
					tech_time: 10,
					time_preprocessing: 4,
					time_taken_mongo: 2,
					time_taken_prediction: 123,
					timestamp: 1565718186345,
					total_time_taken: 132,
				}),
			);
		component.refreshPredictions();
		tick();
		fixture.detectChanges();
		expect(caseService.fetchClassification)
			.toHaveBeenCalled();
		expect(component.recommendedTechs.length)
			.toEqual(1);
	}));

	it('should define predictedSubTech when a suggested one is picked', fakeAsync(() => {
		component.form.controls.suggestedTech.setValue({
			sub_tech: {
				id: '2875',
				name: 'Sourcefire Defense Center / FireSIGHT Management Center',
				probab: 0.339,
			},
			tech: {
				id: '62',
				name: 'Security - Management',
				probab: 0.339,
			},
		});
		fixture.detectChanges();
		expect(component.predictedSubTech)
			.toBe('Sourcefire Defense Center / FireSIGHT Management Center');
	}));

	it('should nullify tech/subtech when suggested value is cleared.', fakeAsync(() => {
		component.form.controls.suggestedTech.setValue({
			sub_tech: {
				id: '1941',
				name: 'Adaptive Security Appliance (ASA) non-VPN problem',
				probab: 0.482,
			},
			tech: {
				id: '54',
				name:
				'Security - Network Firewalls and Intrusion Prevention Systems',
				probab: 0.482,
			},
		});
		tick();
		component.form.controls.suggestedTech.setValue(null);
		tick();
		expect(component.form.controls.subtech.value)
			.toBeNull();
	}));

	it('should call onSeeAll() on seeAlloptions click', () => {
		jest.spyOn(component, 'onSeeAll');
		const button = fixture.debugElement.query(By.css('a[data-auto-id="SeeAllTechs"]'));
		button.nativeElement.click();

		expect(component.onSeeAll)
			.toHaveBeenCalled();
	});

	it('should falsy displaySuggestion on seeAll', () => {
		component.displaySuggestions = true;
		component.onSeeAll();

		fixture.detectChanges();
		expect(component.displaySuggestions)
			.toBeFalsy();
	});

	it('should call refreshPredictions', () => {
		jest.spyOn(component, 'refreshPredictions');
		component.displayAll = true;
		component.onRefreshSuggestions();
		fixture.detectChanges();

		expect(component.displayAll)
			.toBeFalsy();
		expect(component.form.controls.suggestedTech.value)
			.toBeNull();
		expect(component.refreshPredictions)
			.toHaveBeenCalled();
	});

	it('should display suggestion on collapsing showAll', () => {
		component.displaySuggestions = false;
		component.displayAll = false;
		component.showAllCollapse();

		fixture.detectChanges();
		expect(component.displaySuggestions)
			.toBeTruthy();

		component.showSuggestionsCollapse();
		fixture.detectChanges();
		expect(component.displayAll)
			.toBeTruthy();
	});

});
