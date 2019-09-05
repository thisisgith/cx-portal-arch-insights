import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnauthorizedUserComponent } from './unauthorized-user.component';
import { UnauthorizedUserModule } from './unauthorized-user.module';

describe('UnauthorizedUserComponent', () => {
	let component: UnauthorizedUserComponent;
	let fixture: ComponentFixture<UnauthorizedUserComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [UnauthorizedUserModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UnauthorizedUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
