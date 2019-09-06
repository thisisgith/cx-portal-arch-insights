import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
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
	let clearStateSpy: jasmine.Spy;
	let modalHideSpy: jasmine.Spy;

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

	beforeEach(async(() => {
		stateService = TestBed.get(SetupIEStateService);
		modalService = TestBed.get(CuiModalService);
		clearStateSpy = spyOn(stateService, 'clearState')
			.and
			.returnValue();
		modalHideSpy = spyOn(modalService, 'hide');
	}));

	beforeEach(() => {
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
		expect(modalHideSpy)
			.toHaveBeenCalled();
	});

	it('should start over', () => {
		component.startOver();
		expect(clearStateSpy)
			.toHaveBeenCalled();
	});
});
