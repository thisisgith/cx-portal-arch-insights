import { async, inject, TestBed } from '@angular/core/testing';
import { AlertService, AlertResults } from './alert';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { mockData } from './mock/alert';

describe('AlertService', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MicroMockModule,
				HttpClientModule,
			],
			providers: [
				AlertService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	it('should inject', inject([AlertService], (service: AlertService) => {
		expect(service)
			.toBeTruthy();
	}));

	it('should handle a read', inject([AlertService], (service: AlertService) => {
		service.read()
			.subscribe(
			(results: AlertResults) => {
				expect(results.health.bugs.length)
					.toEqual(mockData.health.bugs.length);
			});
	}));
});
