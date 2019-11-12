import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ControlPointUserManagementAPIService,
  UserAddResponseModel,
  RoleDetailsResponseModel,
} from '@sdp-api';
import { AddUserModule } from './add-user.module';
import { AddUserComponent } from './add-user.component';
import { configureTestSuite } from 'ng-bullet';
import { of } from 'rxjs';

describe('AddUserComponent', () => {
	let component: AddUserComponent;
	let service: ControlPointUserManagementAPIService;
	let fixture: ComponentFixture<AddUserComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AddUserModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		service = TestBed.get(ControlPointUserManagementAPIService);
		fixture = TestBed.createComponent(AddUserComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('Populate Role Dropdown', () => {
		spyOn(service, 'getListRolesForGivenUserUsingGET')
			.and
			.returnValue(of(<RoleDetailsResponseModel> { }));
		component.ngOnInit();
		expect(service.getListRolesForGivenUserUsingGET)
			.toHaveBeenCalled();
	});

	it('postAddUser Service to be called on next', () => {
		spyOn(service, 'AddNewUserUsingPOST')
			.and
			.returnValue(of(<UserAddResponseModel> { }));
		component.onContinue();
		expect(component.userDetails)
			.toBeDefined();
		expect(service.AddNewUserUsingPOST)
			.toHaveBeenCalled();
	});

});
