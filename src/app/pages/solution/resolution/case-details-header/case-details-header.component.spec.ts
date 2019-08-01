import { Component, ViewChild } from '@angular/core';
import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { CaseScenarios } from '@mock';
import { CaseDetailsHeaderComponent } from './case-details-header.component';
import { Case } from '@interfaces';
import { RMAService } from '@services';
import { CaseDetailsHeaderModule } from './case-details-header.module';

/**
 * Wrapper component for testing ngOnChanges
 */
@Component({
	template: `
		<app-case-details-header [case]="case"
			[caseDetails]="details">
		</app-case-details-header>`,
})
class WrapperComponent {
	@ViewChild(CaseDetailsHeaderComponent, { static: true }) public headerComponent
		: CaseDetailsHeaderComponent;
	public case: Case = { caseNumber: '1234' };
	public details = null;
}

describe('CaseDetailsHeaderComponent', () => {
	let wrapperComponent: WrapperComponent;
	let component: CaseDetailsHeaderComponent;
	let fixture: ComponentFixture<WrapperComponent>;
	let service: RMAService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [
				CaseDetailsHeaderModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(RMAService);
		spyOn(service, 'getByNumber')
			.and
			.returnValue(of(null));
		fixture = TestBed.createComponent(WrapperComponent);
		wrapperComponent = fixture.componentInstance;
		component = fixture.componentInstance.headerComponent;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should return the correct severity color', () => {
		expect(component.getSeverityColor('1'))
			.toEqual('danger');
		expect(component.getSeverityColor('2'))
			.toEqual('warning');
		expect(component.getSeverityColor('3'))
			.toEqual('warning-alt');
		expect(component.getSeverityColor('4'))
			.toEqual('info');
	});

	it('should call rma details for multiple RMA numbers', () => {
		component.getRMADetails('800000000, 800000001');
		expect(service.getByNumber)
			.toHaveBeenCalledTimes(2);
	});

	it('should keep an empty array if there are no RMA numbers', fakeAsync(() => {
		component.getRMADetails(null);
		tick();
		expect(component.rmaRecords)
			.toEqual([]);
	}));

	it('should stop loading when it recieves case details', () => {
		wrapperComponent.details = CaseScenarios[0].scenarios.GET[0].response.body;
		fixture.detectChanges();
		expect(component.loading)
			.toBeFalsy();
	});

	it('should start loading again when caseNumber changes', () => {
		wrapperComponent.details = CaseScenarios[0].scenarios.GET[0].response.body;
		fixture.detectChanges();
		expect(component.loading)
			.toBeFalsy();
		wrapperComponent.case = { caseNumber: '5678' };
		fixture.detectChanges();
		expect(component.loading)
			.toBeTruthy();
	});
});
