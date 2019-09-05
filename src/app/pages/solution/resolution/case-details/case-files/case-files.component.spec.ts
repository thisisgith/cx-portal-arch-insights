import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CaseFilesComponent } from './case-files.component';
import { CaseFilesModule } from './case-files.module';

describe('CaseFilesComponent', () => {
	let component: CaseFilesComponent;
	let fixture: ComponentFixture<CaseFilesComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CaseFilesModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseFilesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should give the correct file icon and label', () => {
		expect(component.getFileIconLabel('image/png'))
			.toEqual({ icon: 'icon-file-image-o', label: 'Image (png)' });
		expect(component.getFileIconLabel('image/jpeg'))
			.toEqual({ icon: 'icon-file-image-o', label: 'Image (jpeg)' });
		expect(component.getFileIconLabel('application/pdf'))
			.toEqual({ icon: 'icon-file-pdf-o', label: 'PDF' });
		expect(component.getFileIconLabel('text/plain'))
			.toEqual({ icon: 'icon-file-text-o', label: 'Plain Text' });
		expect(component.getFileIconLabel('text/csv'))
			.toEqual({ icon: 'icon-file-excel-o', label: 'Excel (csv)' });
		expect(component.getFileIconLabel('application/xls'))
			.toEqual({ icon: 'icon-file-excel-o', label: 'Excel (csv)' });
		expect(component.getFileIconLabel('application/x-tar'))
			.toEqual({ icon: 'icon-file-archive-o', label: 'Archive' });
		expect(component.getFileIconLabel('test'))
			.toEqual({ icon: 'icon-file', label: 'File' });
	});

	it('shouldn\'t contain any files if no case is selected', () => {
		component.case = null;
		expect(component.caseFiles)
			.toBeUndefined();
	});

	it('should refresh file list if different case is selected', () => {
		spyOn(component, 'refresh');
		component.case = {
			caseNumber: '1234',
		};
		fixture.detectChanges();
		component.ngOnChanges({
			caseFilesData: {
				currentValue: { fileDetail: [] },
				firstChange: false,
				isFirstChange: () => false,
				previousValue: { fileDetail: [] },
			},
		});
		expect(component.refresh)
			.toHaveBeenCalled();
	});
});
