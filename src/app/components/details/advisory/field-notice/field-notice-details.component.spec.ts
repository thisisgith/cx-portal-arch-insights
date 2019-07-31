import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FieldNoticeDetailsComponent } from './field-notice-details.component';
import { FieldNoticeDetailsModule } from './field-notice-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProductAlertsService, InventoryService } from '@sdp-api';
import { environment } from '@environment';
import { of, throwError } from 'rxjs';
import * as _ from 'lodash';
import {
	user,
	MockFieldNoticeBulletins,
	MockFieldNoticeAdvisories,
	MockFieldNotices,
} from '@mock';
import { HttpErrorResponse } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';

describe('FieldNoticeDetailsComponent', () => {
	let component: FieldNoticeDetailsComponent;
	let fixture: ComponentFixture<FieldNoticeDetailsComponent>;
	let productAlertsService: ProductAlertsService;
	let inventoryService: InventoryService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FieldNoticeDetailsModule,
				HttpClientTestingModule,
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
		fixture = TestBed.createComponent(FieldNoticeDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should handle failing api calls', done => {
		component.advisory = MockFieldNoticeAdvisories[0];
		component.id = _.toString(MockFieldNoticeAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockFieldNoticeAdvisories[0],
				});

			expect(d)
				.toEqual(component.data);

			done();
		});

		component.ngOnInit();
		fixture.detectChanges();
	});

	it('should fetch the advisory information given an advisory', done => {
		const mockAdvisories = _.filter(MockFieldNotices,
			{ fieldNoticeId: MockFieldNoticeAdvisories[0].id });

		component.advisory = MockFieldNoticeAdvisories[0];
		component.id = _.toString(MockFieldNoticeAdvisories[0].id);
		component.customerId = user.info.customerId;

		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(inventoryService, 'getAssets')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));

		spyOn(productAlertsService, 'getFieldNotice')
			.and
			.returnValue(of({ data: mockAdvisories }));

		const bulletins = _.filter(MockFieldNoticeBulletins,
			{ fieldNoticeId: MockFieldNoticeAdvisories[0].id });
		spyOn(productAlertsService, 'getFieldNoticeBulletin')
			.and
			.returnValue(of({ data: bulletins }));

		component.details
		.subscribe(d => {
			fixture.detectChanges();

			expect(d)
				.toEqual({
					advisory: MockFieldNoticeAdvisories[0],
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
		component.advisory = MockFieldNoticeAdvisories[0];
		component.id = _.toString(MockFieldNoticeAdvisories[0].id);
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
			.toEqual(MockFieldNoticeAdvisories[0]);

		component.advisory = MockFieldNoticeAdvisories[1];
		component.id = _.toString(MockFieldNoticeAdvisories[1].id);
		component.ngOnChanges({
			id: {
				currentValue: component.id,
				firstChange: false,
				isFirstChange: () => false,
				previousValue: _.toString(MockFieldNoticeAdvisories[1].id),
			},
		});

		fixture.detectChanges();
		expect(component.data.advisory)
			.toEqual(MockFieldNoticeAdvisories[1]);
	});
});
