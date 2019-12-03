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
import { RoleDetails } from '@sdp-api';

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

	it('define role name and description', () => {
		const dummyData: RoleDetails = {
			role : 'test',
			roleDescription : 'test',
			roleDisplayName : 'test',
			tenant : 'test',
			type_1 : 'test',
			value_1 : 'test',
		};
		component.user.roles[0] = dummyData;
		component.ngOnInit();
		expect(component.roleName)
			.toBeDefined();
		expect(component.roleDescription)
			.toBeDefined();

	});

	it('define role name and description for user without any data', () => {
		const dummyData = null;
		component.user.roles[0] = dummyData;
		component.ngOnInit();
		expect(component.roleName)
			.toBeDefined();

	});

	it('handle click when clicked on same role', () => {
		const dummyData: RoleDetails = {
			role : 'test',
			roleDescription : 'test',
			roleDisplayName : 'test',
			tenant : 'test',
			type_1 : 'test',
			value_1 : 'test',
		};
		component.roleName = 'test';
		component.handleClick(dummyData);
		expect()
			.nothing();
	});
});
