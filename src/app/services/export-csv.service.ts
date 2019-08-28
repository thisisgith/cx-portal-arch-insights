import { Injectable } from '@angular/core';

/**
 * Service for export to csv file and download the file
 */
@Injectable({
	providedIn: 'root',
})
export class ExportCsvService {

	/**
	 * Export to csv file and download the file
	 *
	 * @param fileName string with file name
	 * @param response string with response body
	 * @returns success
	 */
	public exportToCsv (fileName: string, response: string): any  {
		const downloadLink = document.createElement('a');
		const blob = new Blob(['\ufeff', response]);
		const url = URL.createObjectURL(blob);
		downloadLink.href = url;
		downloadLink.download = `${fileName}${new Date().getTime()}.csv`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);

		return 'success';
	}
}
