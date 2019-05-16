import { async, inject, TestBed } from '@angular/core/testing';
import { SolutionService } from './solution';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';

describe('SolutionService', () => {

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				MicroMockModule,
				HttpClientModule,
			],
			providers: [
				SolutionService,
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	it('should inject', inject([SolutionService], (service: SolutionService) => {
		expect(service)
			.toBeTruthy();
	}));
});
