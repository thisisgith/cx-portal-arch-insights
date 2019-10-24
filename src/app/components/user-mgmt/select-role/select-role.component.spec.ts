import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { SelectRoleComponent } from './select-role.component';
import { SelectRoleModule } from './select-role.module';

describe('SelectRoleComponent', () => {
	let component: SelectRoleComponent;
	let fixture: ComponentFixture<SelectRoleComponent>;
	// let de: DebugElement;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				SelectRoleModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectRoleComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		component.clickout(new MouseEvent('click'));
		component.toggleExpanded();
		expect(component)
			.toBeTruthy();
	});
});
