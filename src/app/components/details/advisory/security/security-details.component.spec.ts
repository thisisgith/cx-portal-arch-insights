import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityDetailsComponent } from './security-details.component';
import { SecurityDetailsModule } from './security-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MicroMockModule } from '@cui-x-views/mock';
import { ProductAlertsService, InventoryService } from '@sdp-api';
import { environment } from '@environment';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';
import {
	user,
	MockAdvisorySecurityAdvisories,
	MockSecurityAdvisoryBulletins,
	MockSecurityAdvisories,
} from '@mock';
import { HttpErrorResponse } from '@angular/common/http';

describe('SecurityDetailsComponent', () => {
	let component: SecurityDetailsComponent;
	let fixture: ComponentFixture<SecurityDetailsComponent>;
	let productAlertsService: ProductAlertsService;
	let inventoryService: InventoryService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				SecurityDetailsModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();

		inventoryService = TestBed.get(InventoryService);
		productAlertsService = TestBed.get(ProductAlertsService);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SecurityDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing api calls', done => {
		component.advisory = MockAdvisorySecurityAdvisories[0];
		component.id = _.toString(MockAdvisorySecurityAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockAdvisorySecurityAdvisories[0],
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should fetch the advisory information given an advisory', done => {
		const mockAdvisories = _.filter(MockSecurityAdvisories,
			{ advisoryId: MockAdvisorySecurityAdvisories[0].id });

		component.advisory = MockAdvisorySecurityAdvisories[0];
		component.id = _.toString(MockAdvisorySecurityAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(productAlertsService, 'getSecurityAdvisories')
			.and
			.returnValue(of({ data: mockAdvisories }));

		const bulletins = _.filter(MockSecurityAdvisoryBulletins,
			{ securityAdvisoryInstanceId: MockAdvisorySecurityAdvisories[0].id });
		spyOn(productAlertsService, 'getPSIRTBulletin')
			.and
			.returnValue(of({ data: bulletins }));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockAdvisorySecurityAdvisories[0],
					bulletin: _.head(bulletins),
					notice: _.head(mockAdvisories),
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should handle changing advisories', () => {
		component.advisory = MockAdvisorySecurityAdvisories[0];
		component.id = _.toString(MockAdvisorySecurityAdvisories[0].id);
		component.customerId = user.info.customerId;

		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		component.ngOnInit();
		fixture.detectChanges();

		expect(component.data.advisory)
			.toEqual(MockAdvisorySecurityAdvisories[0]);

		component.advisory = MockAdvisorySecurityAdvisories[1];
		component.id = _.toString(MockAdvisorySecurityAdvisories[1].id);
		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(MockAdvisorySecurityAdvisories[1].id),
			},
		});

		fixture.detectChanges();
		expect(component.data.advisory)
			.toEqual(MockAdvisorySecurityAdvisories[1]);
	});
});
