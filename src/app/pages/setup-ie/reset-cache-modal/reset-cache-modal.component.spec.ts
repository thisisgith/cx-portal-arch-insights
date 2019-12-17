import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ResetCacheModal } from './reset-cache-modal.component';
import { I18nPipeModule } from '@cisco-ngx/cui-pipes';
import { environment } from '../../../../environments/environment';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { SetupIEStateService } from '../setup-ie-state.service';

describe('ResetCacheModal', () => {
	let component: ResetCacheModal;
	let fixture: ComponentFixture<ResetCacheModal>;
	let stateService: SetupIEStateService;
	let modalService: CuiModalService;
	let modalSpy: any;
	let clearStateSpy: any;
	configureTestSuite(() => {
		TestBed.configureTestingModule({
			declarations: [ResetCacheModal],
			imports: [
				HttpClientTestingModule,
				I18nPipeModule,
				ReactiveFormsModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(() => {
		stateService = TestBed.get(SetupIEStateService);
		stateService.clearState();
		clearStateSpy = jest.spyOn(stateService, 'clearState');
		modalService = TestBed.get(CuiModalService);
		modalSpy = jest.spyOn(modalService, 'hide');
		localStorage.removeItem(environment.ieSetup.DNAC_LS_KEY);
		fixture = TestBed.createComponent(ResetCacheModal);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should close', () => {
		component.continue();
		expect(modalSpy)
			.toHaveBeenCalled();
	});

	it('should start over', () => {
		component.startOver();
		expect(clearStateSpy)
			.toHaveBeenCalled();
	});

});
