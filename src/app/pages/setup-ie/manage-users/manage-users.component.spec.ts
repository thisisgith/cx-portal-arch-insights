import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { ManageUsersComponent } from './manage-users.component';
import { ManageUsersModule } from './manage-users.module';

describe('ManageUsersComponent', () => {
	let component: ManageUsersComponent;
	let fixture: ComponentFixture<ManageUsersComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				ManageUsersModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ManageUsersComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
