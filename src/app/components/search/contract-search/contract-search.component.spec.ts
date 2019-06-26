import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ContractsService } from '@cui-x/sdp-api';
import { ContractScenarios } from '@mock';
import { ContractSearchComponent } from './contract-search.component';
import { ContractSearchModule } from './contract-search.module';
import { HttpErrorResponse } from '@angular/common/http';

describe('ContractSearchComponent', () => {
	let component: ContractSearchComponent;
	let service: ContractsService;
	let fixture: ComponentFixture<ContractSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ContractSearchModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ContractsService);
		fixture = TestBed.createComponent(ContractSearchComponent);
		component = fixture.componentInstance;
		component.contractNumber = { query: '230000000' };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		spyOn(service, 'getContractDetails')
			.and
			.returnValue(of(ContractScenarios[0].scenarios.GET[0].response.body));
		component.contractNumber = { query: '230000001' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(service.getContractDetails)
			.toHaveBeenCalled();
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(service, 'getContractDetails')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(service, 'headContractsProductsCoveragesResponse')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.contractData)
			.toBe(null);
		expect(component.coverageCount)
			.toBe(null);
	});
});
