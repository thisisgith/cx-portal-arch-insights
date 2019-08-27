import { TestBed } from '@angular/core/testing';

import { ExportCsvService } from './export-csv.service';

describe('ExportCsvService', () => {

	let exportCsvService: ExportCsvService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ExportCsvService],
		});
		exportCsvService = TestBed.get(ExportCsvService);
	});

	it('should be created', () => {
		expect(exportCsvService)
			.toBeTruthy();
	});

	it('should export data to csv file', () => {
		const fileName = 'exportFile';
		const responseString = 'column 1,column 2,column 3,column 4' +
			'column 5,column 6,column 7,column 8,';

		exportCsvService = new ExportCsvService();

		expect(exportCsvService.exportToCsv(fileName, responseString))
			.toEqual('success');
	});
});
