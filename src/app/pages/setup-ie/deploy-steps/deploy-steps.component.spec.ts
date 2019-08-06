import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SetupIEStateService } from '../setup-ie-state.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import * as _ from 'lodash-es';

import { DeployStepsComponent } from './deploy-steps.component';
import { DeployStepsModule } from './deploy-steps.module';
import { environment } from '../../../../environments/environment';

describe('DeployStepsComponent', () => {
	let component: DeployStepsComponent;
	let fixture: ComponentFixture<DeployStepsComponent>;
	let stateService: SetupIEStateService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				DeployStepsModule,
				NoopAnimationsModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
		stateService = TestBed.get(SetupIEStateService);
		stateService.clearState();
		stateService.setState({
			deployStepsSet: 'ova:0',
			ovaSelection: 'vbox',
		});
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeployStepsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should go to next step on Enter keypress', fakeAsync(() => {
		const sub = component.onStepComplete
			.subscribe(() => {
				expect()
					.nothing();
				sub.unsubscribe();
			});
		component.currentSlide = {
			buttonText: 'test', content: 'test', src: 'test', stepLabel: 'test',
			stepNum: 1, type: 'image',
		};
		component.slides = [
			component.currentSlide,
			{
				buttonText: 'test2', content: 'test2', src: 'test2', stepLabel: 'test2',
				stepNum: 2, type: 'image',
			},
		];
		component.keyEvent(<any> { keyCode: 0 });
		component.keyEvent(<any> { keyCode: 13 });
		fixture.detectChanges();
		expect(component.currentSlide.stepNum)
			.toBe(2);
		component.keyEvent(<any> { keyCode: 13 });
	}));

	it('should react to changes', () => {
		component.slides = null;
		component.ngOnChanges();
		expect(component.slides[0])
			.not
			.toBeNull();
		_.set(component, 'inputs.slideSet', 'vcenter');
		component.slides = null;
		component.ngOnChanges();
		expect(component.slides[0])
			.not
			.toBeNull();
		_.set(component, 'inputs.slideSet', 'vbox');
		component.slides = null;
		component.ngOnChanges();
		expect(component.slides[0])
			.not
			.toBeNull();
		_.set(component, 'inputs.slideSet', 'ie');
		component.slides = null;
		component.ngOnChanges();
		expect(component.slides[0])
			.not
			.toBeNull();
	});
});
