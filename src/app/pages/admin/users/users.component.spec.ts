import { configureTestSuite } from 'ng-bullet';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersModule } from './users.module';

describe('UsersComponent', () => {
	let component: UsersComponent;
	let fixture: ComponentFixture<UsersComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				UsersModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
