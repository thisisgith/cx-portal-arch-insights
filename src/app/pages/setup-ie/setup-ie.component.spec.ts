import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SetupIeComponent } from './setup-ie.component';
import { SetupIeModule } from './setup-ie.module';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CuiModalModule, CuiModalService } from '@cisco-ngx/cui-components';
import { SetupIEStateService } from './setup-ie-state.service';
import { UtilsService } from '@services';
import { DeployStepsComponent } from './deploy-steps/deploy-steps.component';
import { SETUP_STATES } from '@classes';

describe('SetupIeComponent', () => {
	let component: SetupIeComponent;
	let fixture: ComponentFixture<SetupIeComponent>;
	let stateService: SetupIEStateService;
	let modalService: CuiModalService;
	let modalSpy: jasmine.Spy;
	let router: Router;
	let utils: UtilsService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				CuiModalModule,
				HttpClientTestingModule,
				RouterTestingModule,
				SetupIeModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				UtilsService,
			],
		});
	});

	beforeEach(async(() => {
		router = TestBed.get(Router);
		stateService = TestBed.get(SetupIEStateService);
		stateService.clearState();
		modalService = TestBed.get(CuiModalService);
		modalSpy = spyOn(modalService, 'showComponent')
			.and
			.returnValue(new Promise(resolve => resolve()));
		utils = TestBed.get(UtilsService);
		localStorage.removeItem(environment.ieSetup.DNAC_LS_KEY);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SetupIeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should prompt to reuse cache if there is a saved state', () => {
		modalSpy.and
			.returnValue(new Promise(resolve => resolve(true)));
		stateService.setState({
			compKey: 1,
			ovaSelection: 'vbox',
		});
		component.ngOnInit();
		component.ngAfterViewInit();
	});

	it('should pick up route changes', fakeAsync(async () => {
		await router.navigate([], {
			queryParams: {
				compKey: '22',
				ovaSelection: 'vbox',
			},
		});
		expect(component.currentStep)
			.toBe(7);
	}));

	it('should add NoDNACComponent step when no DNAC detected', fakeAsync(async () => {
		utils.setLocalStorage(environment.ieSetup.DNAC_LS_KEY, { noDNAC: true });
		await router.navigate([], {
			queryParams: {
				compKey: '0',
				ovaSelection: 'vbox',
			},
		});
		expect(component.steps.length)
			.toBe(9);
	}));

	it('should trigger a new step', fakeAsync(async () => {
		await router.navigate([], {
			queryParams: {
				compKey: '0',
				ovaSelection: 'vbox',
			},
		});
		component.activeComponent.instance.onStepComplete.emit([
			{
				state: SETUP_STATES.INIT,
				type: DeployStepsComponent,
			},
		]);
		expect(component.steps.length)
			.toBe(3);
		await router.navigate([], {
			queryParams: {
				compKey: '2',
				ovaSelection: 'vbox',
			},
		});
		component.activeComponent.instance.onStepComplete.emit();
		await router.navigate([], {
			queryParams: {
				compKey: '22',
				ovaSelection: 'vbox',
			},
		});
		component.activeComponent.instance.onStepComplete.emit();
	}));

	it('should add inputs to a step', fakeAsync(async () => {
		await router.navigate([], {
			queryParams: {
				compKey: '2',
				ovaSelection: 'vbox',
			},
		});
		component.activeComponent.instance.onStepComplete.emit();
		expect(component.steps.length)
			.toBe(8);
	}));
});
