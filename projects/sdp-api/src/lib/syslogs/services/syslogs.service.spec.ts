import { TestBed } from '@angular/core/testing';

import { SyslogsService } from './syslogs.service';

describe('SyslogsService', () => {
	beforeEach(() => TestBed.configureTestingModule({ }));

	it('should be created', () => {
		const service: SyslogsService = TestBed.get(SyslogsService);
		// tslint:disable-next-line: newline-per-chained-call
		expect(service).toBeTruthy();
	});
});
