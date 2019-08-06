import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { BeginInstallationComponent } from './begin-installation.component';
import { BeginInstallationModule } from './begin-installation.module';

describe('BeginInstallationComponent', () => {
	let component: BeginInstallationComponent;
	let fixture: ComponentFixture<BeginInstallationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [BeginInstallationModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BeginInstallationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should go to next step', fakeAsync(() => {
		const sub = component.onStepComplete
			.subscribe(() => {
				expect()
					.nothing();
				sub.unsubscribe();
			});
		component.onBegin();
	}));

	it('should go to next step on Enter keypress', fakeAsync(() => {
		const sub = component.onStepComplete
			.subscribe(() => {
				expect()
					.nothing();
				sub.unsubscribe();
			});
		component.keyEvent(<any> { keyCode: 0 });
		component.keyEvent(<any> { keyCode: 13 });
	}));
});
