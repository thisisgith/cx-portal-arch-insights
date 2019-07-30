import {
	Component,
	ViewChild,
	TemplateRef,
	Input,
	SimpleChanges,
	OnChanges,
	OnInit,
} from '@angular/core';
import { LogService } from '@cisco-ngx/cui-services';
import { File, Case } from '@interfaces';
import { I18n } from '@cisco-ngx/cui-utils';
import { CuiTableOptions } from '@cisco-ngx/cui-components';
import { caseFileIcons } from '@classes';
import * as _ from 'lodash-es';
import { DownloadLinkPipe } from './pipes/download-link.pipe';

/**
 * CaseFiles List Component
 */
@Component({
	selector: 'app-case-files',
	styleUrls: ['./case-files.component.scss'],
	templateUrl: './case-files.component.html',
})
export class CaseFilesComponent implements OnInit, OnChanges {
	@Input() public case: Case;
	@Input() public caseFilesData: { };
	public  caseFiles: File[];
	private downloadLinkPipe = new DownloadLinkPipe();

	public fileTableOptions: CuiTableOptions;

	@ViewChild('fileTypeTmpl', { static: true }) public fileTypeTemplate: TemplateRef<any>;
	@ViewChild('downloadTmpl', { static: true }) public downloadTemplate: TemplateRef<any>;
	@ViewChild('fileSizeTmpl', { static: true }) public fileSizeTemplate: TemplateRef<any>;
	@ViewChild('fileNameTmpl', { static: true }) public fileNameTemplate: TemplateRef<any>;

	constructor (
		private logger: LogService,
	) { }

	/** ngOnInit */
	public ngOnInit () {
		this.refresh();
	}

	/**
	 * Refreshes the component
	 */
	public refresh () {
		if (this.caseFiles && this.caseFiles.length > 0) {
			this.buildTable();
		}
	}

	/**
	 * Build Table
	 */
	public buildTable () {
		this.fileTableOptions = new CuiTableOptions({
			bordered: true,
			striped: false,
			columns: [
				{
					key: 'fileName',
					name: I18n.get('_RMAFileName_'),
					sortable: true,
					template: this.fileNameTemplate,
				},
				{
					key: 'fileContentType',
					name: I18n.get('_RMAFileType_'),
					sortable: true,
					template: this.fileTypeTemplate,
				},
				{
					key: 'fileSize',
					name: I18n.get('_RMAFileSize_'),
					sortable: true,
					template: this.fileSizeTemplate,
				},
				{
					template: this.downloadTemplate,
				},
			],
		});
	}

	/**
	 * get the file icon and label
	 * @param fileContentType of case
	 * @returns void
	 */
	public getFileIconLabel (fileContentType: string) {
		if (caseFileIcons[fileContentType]) {
			return caseFileIcons[fileContentType];
		}
		return caseFileIcons.default;
	}

	/**
	 * get download URL of file
	 * @param fileName for download
	 * @returns dowload link
	 */
	public getDownloadURL (fileName: string) {
		return this.downloadLinkPipe.transform(fileName, this.case.caseNumber);
	}

	/**
	 * Sort file list based on selected column
	 * @param event on click of table sort
	 */
	public onTableSortingChanged (event) {
		this.caseFiles = _.sortBy(this.caseFiles, [function (r) { return r.fileInfo[event.key]; }]);
		if (event.sortDirection === 'desc') {
			this.caseFiles = this.caseFiles.reverse();
		}
	}

	/**
	 * Checks if our currently selected case has changed
	 * @param changes the changes detected
	 */
	public ngOnChanges (changes: SimpleChanges) {
		const filesData = _.get(changes, ['caseFilesData', 'currentValue']);
		if (Object.keys(filesData).length > 0) {
			this.caseFilesData = filesData;
			this.caseFiles = _.get(this.caseFilesData, ['fileDetail']);
			if (!(this.caseFiles instanceof Array)) {
				this.caseFiles = [this.caseFiles];
			}
			this.refresh();
		}
	}

}
