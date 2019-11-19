import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FingerprintDetailsComponent } from './fingerprint-details.component';
import { FingerprintDetailsModule } from './fingerprint-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FingerprintDetailsComponent', () => {
	let component: FingerprintDetailsComponent;
	let fixture: ComponentFixture<FingerprintDetailsComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [FingerprintDetailsModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(FingerprintDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should unset the selected System', () => {
		component.onPanelClose();
		expect(component.selectedSystem)
			.toBeFalsy();
		expect(component.showAssetDetailsView)
			.toBeFalsy();
	});

	it('should handle on panel hidden', () => {
		const panelCloseSpy = spyOn(component, 'onAllPanelsClose');

		component.handleHidden();
		expect(panelCloseSpy)
			.toHaveBeenCalled();
	});
});
