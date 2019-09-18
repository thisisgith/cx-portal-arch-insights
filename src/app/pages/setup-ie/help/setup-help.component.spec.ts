import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SetupHelpComponent } from './setup-help.component';
import { SetupIeModule } from '../setup-ie.module';
import { environment } from '../../../../environments/environment';
import { RouterTestingModule } from '@angular/router/testing';
import { CuiModalModule } from '@cisco-ngx/cui-components';

describe('SetupHelpComponent', () => {
	let component: SetupHelpComponent;
	let fixture: ComponentFixture<SetupHelpComponent>;

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
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SetupHelpComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		component.openContactSupport();
		expect(component)
			.toBeTruthy();
	});
});
