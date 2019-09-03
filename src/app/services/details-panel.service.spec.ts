import { TestBed } from '@angular/core/testing';

import { DetailsPanelStackService } from './details-panel.service';

describe('DetailsPanelService', () => {
	beforeEach(() => TestBed.configureTestingModule({ }));

	it('should be created', () => {
		const service: DetailsPanelStackService = TestBed.get(DetailsPanelStackService);
		expect(service)
		.toBeTruthy();
	});
});
