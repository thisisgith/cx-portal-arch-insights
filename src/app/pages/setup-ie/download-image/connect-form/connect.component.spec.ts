import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ConnectComponent } from './connect.component';
import { ConnectModule } from './connect.module';

describe('InstallProgressComponent', () => {
	let component: ConnectComponent;
	let fixture: ComponentFixture<ConnectComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				ConnectModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ConnectComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		component.accountForm.get('ipAddress')
			.setValue('testing');
		fixture.detectChanges();
		component.accountForm.get('ipAddress')
			.setValue('127.0.0.1');
		component.onSubmit();
		component.onTutorialClick();
		fixture.detectChanges();
		component.keyEvent(new KeyboardEvent('32'));
		expect(component.accountForm.get('ipAddress').value)
			.toBe('127.0.0.1');
	});
});
