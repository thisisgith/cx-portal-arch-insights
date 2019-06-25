import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { RMASearchComponent } from './rma-search.component';
import { RMASearchModule } from './rma-search.module';
import { RMAScenarios } from '@mock';
import { RMAService } from '@services';

describe('RMASearchComponent', () => {
	let component: RMASearchComponent;
	let service: RMAService;
	let fixture: ComponentFixture<RMASearchComponent>;
	const defaultRmaNumber = '800000000';

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RMASearchModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

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
		spyOn(service, 'getByNumber')
			.and
			.returnValue(of(RMAScenarios[0].scenarios.GET[0].response.body));
		component.rmaNumber = defaultRmaNumber;
		fixture.detectChanges();
		expect(service.getByNumber)
			.toHaveBeenCalled();
	});

	it('should emit a hide event if no RMA has been found', () => {
		spyOn(service, 'getByNumber')
			.and
			.returnValue(of(RMAScenarios[0].scenarios.GET[3].response.body));
		spyOn(component.hide, 'emit');
		component.rmaNumber = '8000000001';
		fixture.detectChanges();
		expect(component.hide.emit)
			.toHaveBeenCalled();
	});

	it(`should emit a toggleGeneralSearch event when first created to hide general search,
	and a second time if there is a product description to search for`, () => {
		spyOn(service, 'getByNumber')
			.and
			.returnValue(of(RMAScenarios[0].scenarios.GET[0].response.body));
		spyOn(component.toggleGeneralSearch, 'emit');
		component.rmaNumber = defaultRmaNumber;
		fixture.detectChanges();
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledWith({
				hide: true,
			});
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledWith({
				context: 'serialno',
				hide: false,
				searchString: '^Cisco ASR 920-12SZ-IM Router 0',
			});
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledTimes(2);
	});

	it(`should not emit a second toggleGeneralSearch event
	when no product description is found`, () => {
		spyOn(service, 'getByNumber')
			.and
			.returnValue(of(RMAScenarios[0].scenarios.GET[1].response.body));
		spyOn(component.toggleGeneralSearch, 'emit');
		component.rmaNumber = defaultRmaNumber;
		fixture.detectChanges();
		expect(component.toggleGeneralSearch.emit)
			.toHaveBeenCalledTimes(1);
	});
});
