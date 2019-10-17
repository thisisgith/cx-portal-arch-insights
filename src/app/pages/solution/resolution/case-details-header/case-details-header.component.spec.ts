import { configureTestSuite } from 'ng-bullet';
import { Component, ViewChild } from '@angular/core';
import { fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { CaseScenarios } from '@mock';
import { CaseDetailsHeaderComponent } from './case-details-header.component';
import { Case } from '@interfaces';
import { RMAService } from '@services';
import { CaseDetailsHeaderModule } from './case-details-header.module';
import { HttpErrorResponse } from '@angular/common/http';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { UploadFilesContent } from '@cui-x-views/csc';

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
	let cuiModalService: CuiModalService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [
				WrapperComponent,
			],
			imports: [
				CaseDetailsHeaderModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		service = TestBed.get(RMAService);
		cuiModalService = TestBed.get(CuiModalService);
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
		spyOn(service, 'getByNumber')
			.and
			.returnValue(of(null));
		component.rmaStrings = ['800000000', '800000001'];
		component.getRMADetails();
		expect(service.getByNumber)
			.toHaveBeenCalledTimes(2);
	});

	it('should keep an empty array if there are no RMA numbers', fakeAsync(() => {
		component.getRMADetails();
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

	it('should handle failing api call', done => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getByNumber')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.getRMADetails();
		fixture.detectChanges();

		fixture.whenStable()
			.then(() => {
				expect(component.rmaRecords)
					.toEqual([]);

				done();
			});
	});

	it('should close Add Note and Related RMA on ngOnChanges', () => {
		component.ngOnChanges({
			caseDetails: {
				currentValue: { rmaNumber: '800000000' },
				firstChange: false,
				isFirstChange: () => false,
				previousValue: { },
			},
		});
		fixture.detectChanges();
		expect(component.isAddNoteClicked)
			.toBeFalsy();
		expect(component.isRMAClicked)
			.toBeFalsy();
	});

	it('should stop loading when it recieves case details', () => {
		wrapperComponent.details = CaseScenarios[0].scenarios.GET[0].response.body;
		fixture.detectChanges();
		expect(component.loading)
			.toBeFalsy();
	});

	it('should close Add Note if Related RMA is opened', fakeAsync(() => {
		component.isRMAClicked = false;
		component.toggleRMAList();

		expect(component.isRMAClicked)
			.toBeTruthy();
		expect(component.isAddNoteClicked)
			.toBeFalsy();
	}));

	it('should close Related RMA if Add Note is opened', fakeAsync(() => {
		component.isAddNoteClicked = false;
		component.toggleAddNote();

		expect(component.isAddNoteClicked)
			.toBeTruthy();
		expect(component.isRMAClicked)
			.toBeFalsy();
	}));

	it('should open attach file modal', fakeAsync(() => {
		component.case.caseNumber = '92511831';
		spyOn(cuiModalService, 'showComponent');
		component.toggleAddFile();

		expect(cuiModalService.showComponent)
			.toHaveBeenCalledWith(UploadFilesContent, {
				caseNum: '92511831',
				options: { descriptionReq: false },
			});
	}));
});
