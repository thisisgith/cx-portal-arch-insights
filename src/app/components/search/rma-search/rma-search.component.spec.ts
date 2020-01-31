import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { RMASearchComponent } from './rma-search.component';
import { RMASearchModule } from './rma-search.module';
import { RMAScenarios } from '@mock';
import { RMAService } from '@services';
import { HttpErrorResponse } from '@angular/common/http';

describe('RMASearchComponent', () => {
	let component: RMASearchComponent;
	let service: RMAService;
	let fixture: ComponentFixture<RMASearchComponent>;
	const defaultRmaNumber = '800000000';

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				RMASearchModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		service = TestBed.get(RMAService);
		fixture = TestBed.createComponent(RMASearchComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should use service to get RMA based on input number', () => {
		jest.spyOn(service, 'getByNumber')
			.mockReturnValue(of(RMAScenarios[0].scenarios.GET[0].response.body));
		component.rmaNumber = { query: defaultRmaNumber };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(service.getByNumber)
			.toHaveBeenCalled();
	});

	it('should emit a hide event if no RMA has been found', () => {
		jest.spyOn(service, 'getByNumber')
			.mockReturnValue(of(RMAScenarios[0].scenarios.GET[3].response.body));
		jest.spyOn(component.hide, 'emit');
		component.rmaNumber = { query: '8000000001' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalled();
	});

	it('should emit a hide event on error', () => {
		jest.spyOn(service, 'getByNumber')
			.mockReturnValue(throwError(new HttpErrorResponse({
				status: 404,
				statusText: 'Resource not found',
			})));
		jest.spyOn(component.hide, 'emit');
		component.rmaNumber = { query: '8000000001' };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalled();
	});

	it(`should emit a toggleGeneralSearch event when first created to hide general search,
	and a second time if there is a product description to search for`, () => {
		jest.spyOn(service, 'getByNumber')
			.mockReturnValue(of(RMAScenarios[0].scenarios.GET[0].response.body));
		jest.spyOn(component.toggleGeneralSearch, 'emit');
		component.rmaNumber = { query: defaultRmaNumber };
		component.ngOnChanges();
		fixture.detectChanges();
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledWith({
				hide: true,
			});
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledWith({
				hide: false,
				searchString: '^Cisco ASR 920-12SZ-IM Router 0',
			});
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledTimes(2);
	});

});
