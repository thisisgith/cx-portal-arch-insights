import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SetupIEService } from '../setup-ie.service';
import { SetupIEStateService } from '../setup-ie-state.service';
import { of } from 'rxjs';

import { NoDNACComponent, WindowService } from './no-dnac.component';
import { NoDNACModule } from './no-dnac.module';

import { environment } from '../../../../environments/environment';

/** WindowMock */
class WindowMock {
	public location = {
		reload: () => null,
	};
}

describe('NoDNACComponent', () => {
	let component: NoDNACComponent;
	let fixture: ComponentFixture<NoDNACComponent>;
	let setupService: SetupIEService;
	let stateService: SetupIEStateService;
	let dnacSpy: jasmine.Spy;

	describe('with fake window', () => {
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					HttpClientTestingModule,
					NoDNACModule,
					RouterTestingModule,
				],
				providers: [
					SetupIEService,
					{ provide: 'ENVIRONMENT', useValue: environment },
					{ provide: WindowService, useClass: WindowMock },
				],
			});
		});

		beforeEach(async(() => {
			setupService = TestBed.get(SetupIEService);
			stateService = TestBed.get(SetupIEStateService);
			dnacSpy = spyOn(setupService, 'checkForDNAC')
				.and
				.returnValue(of(true));
			stateService.clearState();
			stateService.setState({
				compKey: 8,
			});
			fixture = TestBed.createComponent(NoDNACComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}));

		it('should go to next step on Enter keypress', fakeAsync(() => {
			const sub = component.onStepComplete
				.subscribe(() => {
					expect()
						.nothing();
					sub.unsubscribe();
				});
			component.clickedGuideLink = true;
			component.keyEvent(<any> { keyCode: 0 });
			component.keyEvent(<any> { keyCode: 13 });
			fixture.detectChanges();
		}));
	});

	describe('with real window', () => {
		configureTestSuite(() => {
			TestBed.configureTestingModule({
				imports: [
					HttpClientTestingModule,
					NoDNACModule,
					RouterTestingModule,
				],
				providers: [
					SetupIEService,
					{ provide: 'ENVIRONMENT', useValue: environment },
				],
			});
		});

		beforeEach(async(() => {
			setupService = TestBed.get(SetupIEService);
			stateService = TestBed.get(SetupIEStateService);
			dnacSpy = spyOn(setupService, 'checkForDNAC')
				.and
				.returnValue(of(true));
			stateService.clearState();
			stateService.setState({
				compKey: 8,
			});

			fixture = TestBed.createComponent(NoDNACComponent);
			component = fixture.componentInstance;
			fixture.detectChanges();
		}));

		it('should create', () => {
			expect(component)
				.toBeTruthy();
			expect(dnacSpy)
				.toHaveBeenCalled();
		});

		it('should go home', () => {
			const sub = component.onStepComplete
				.subscribe(() => {
					expect()
						.nothing();
					sub.unsubscribe();
				});
			component.goHome();
			fixture.detectChanges();
		});
	});
});
