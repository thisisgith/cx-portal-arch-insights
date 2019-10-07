import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseSummaryComponent } from './case-summary.component';
import { CaseSummaryModule } from './case-summary.module';

describe('CaseSummaryComponent', () => {
	let component: CaseSummaryComponent;
	let fixture: ComponentFixture<CaseSummaryComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CaseSummaryModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit case serial number to open asset 360 view', () => {
		component.caseDetails = {
			serialNumber: 'FOC1544Y16T',
		};
		spyOn(component.showAssetDetails, 'emit');
		component.openAssetDetailsView();
		expect(component.showAssetDetails.emit)
			.toHaveBeenCalled();
	});
});
