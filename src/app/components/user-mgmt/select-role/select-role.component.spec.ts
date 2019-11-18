import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { SelectRoleComponent } from './select-role.component';
import { SelectRoleModule } from './select-role.module';
import { environment } from '@environment';

describe('SelectRoleComponent', () => {
	let component: SelectRoleComponent;
	let fixture: ComponentFixture<SelectRoleComponent>;
	// let de: DebugElement;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				SelectRoleModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectRoleComponent);
		component = fixture.componentInstance;
		component.user = {
			roles: [],
		};

		fixture.detectChanges();
	});

	it('should create', () => {
		component.clickout(new MouseEvent('click'));
		component.toggleExpanded();
		expect(component)
			.toBeTruthy();
	});
});
