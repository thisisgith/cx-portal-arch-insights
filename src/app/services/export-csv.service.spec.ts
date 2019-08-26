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
		const responseString = 'Event Severity,Syslog Event,Fault IC,Serial' +
			'Number,Case ID,Time Created,Event Status,';

		exportCsvService = new ExportCsvService();

		expect(exportCsvService.exportToCsv(fileName, responseString))
			.toEqual('success');
	});
});
