import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InstallProgressComponent } from './install-progress.component';
import { InstallProgressModule } from './install-progress.module';
import { environment } from '../../../../environments/environment';

describe('InstallProgressComponent', () => {
	let component: InstallProgressComponent;
	let fixture: ComponentFixture<InstallProgressComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				InstallProgressModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(InstallProgressComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
