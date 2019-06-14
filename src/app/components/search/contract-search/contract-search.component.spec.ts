import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ContractsService } from '@cui-x/sdp-api';
import { ContractScenarios } from '@mock';
import { ContractSearchComponent } from './contract-search.component';
import { ContractSearchModule } from './contract-search.module';

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
		spyOn(service, 'getContracts')
			.and
			.returnValue(of(ContractScenarios[0].scenarios.GET[0].response.body));
		fixture = TestBed.createComponent(ContractSearchComponent);
		component = fixture.componentInstance;
		component.contractNumber = '23000000';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		component.contractNumber = '23000001';
		fixture.detectChanges();
		expect(service.getContracts)
			.toHaveBeenCalled();
	});
});
