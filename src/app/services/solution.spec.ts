import { async, inject, TestBed } from '@angular/core/testing';
import { SolutionService, WebinarResults, RacetrackResponseObject } from './solution';
import { HttpClientModule } from '@angular/common/http';
import { MicroMockModule } from '@cui-x-views/mock';
import { environment } from '@environment';
import { solutionATX, solutionRacetrack } from '@mock';

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

	it('should handle querying webinars', inject([SolutionService], (service: SolutionService) => {
		service.queryWebinars()
			.subscribe(
			(results: WebinarResults) => {
				expect(results.webinars.length)
					.toEqual(solutionATX.webinars.length);
			});
	}));

	it('should handle querying the racerack', inject([SolutionService],
		(service: SolutionService) => {
			service.queryRacetrack()
			.subscribe(
			(results: RacetrackResponseObject) => {
				expect(results.solutions.length)
					.toEqual(solutionRacetrack.solutions.length);
			});
		}));
});
