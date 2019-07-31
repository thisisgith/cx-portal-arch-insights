import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '@environment';

/**
 * Pipe for building download link from file name and case number
 * returns correct HTML anchor tag for file download
 */
@Pipe({
	name: 'downloadLink',
})
export class DownloadLinkPipe implements PipeTransform {

	/**
	 * Perform string transformation
	 * @param fileName name
	 * @param caseNo case number
	 * @returns download link
	 */
	public transform (fileName: string, caseNo: string): string {
		if (!fileName || !caseNo) {
			return null;
		}
		let downloadLink = environment.csc.fileDownloadURL;
		downloadLink = downloadLink.replace('{0}', caseNo);
		downloadLink = downloadLink.replace('{1}', fileName);

		return downloadLink;
	}
}
