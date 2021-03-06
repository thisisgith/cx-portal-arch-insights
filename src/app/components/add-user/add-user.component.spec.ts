import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ControlPointUserManagementAPIService,
  UserAddResponseModel,
  RoleDetailsResponseModel,
  VADetailsResponseModel,
} from '@sdp-api';
import { CuiModalService } from '@cisco-ngx/cui-components';
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
				RouterTestingModule,
			],
			providers: [
				ControlPointUserManagementAPIService,
				CuiModalService,
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
		const dummyData: RoleDetailsResponseModel = {
			companyAccountId : '16700',
			saRoles : [{
				role : 'test',
				roleDescription : 'test',
				roleDisplayName : 'test',
				tenant : 'test',
				type_1 : 'test',
				value_1 : 'test',
			}],
			saVaRoles : [{
				role : 'test',
				roleDescription : 'test',
				roleDisplayName : 'test',
				tenant : 'test',
				type_1 : 'test',
				value_1 : 'test',
			}],
		};
		jest.spyOn(service, 'getListRolesForGivenUserUsingGET')
			.mockReturnValue(of(<RoleDetailsResponseModel> (dummyData)));
		component.ngOnInit();
		fixture.detectChanges();
		expect(service.getListRolesForGivenUserUsingGET)
			.toHaveBeenCalled();
		expect(component.response)
			.toBe(dummyData);
		expect(component.items)
			.toBe(dummyData.saRoles);
	});

	it('Populate Virtual Account Dropdown', () => {
		const dummyData: VADetailsResponseModel = {
			status: 200,
			totalRows: 1,
			data: [{
				virtual_account_id: '123',
				name: 'test',
			}],
		};
		spyOn(service, 'getVAListForGivenSACUsingGET')
			.and
			.returnValue(of(<VADetailsResponseModel> (dummyData)));
		component.ngOnInit();
		fixture.detectChanges();
		expect(service.getVAListForGivenSACUsingGET)
			.toHaveBeenCalled();
		expect(component.itemsVa)
			.toBe(dummyData.data);
	});

	it('postAddUser Service to be called on success next', () => {
		const dummyData: UserAddResponseModel = {
			data : [{ status: 200 }],
			status : 200,
		};
		const cuiService = TestBed.get(CuiModalService);
		jest.spyOn(service, 'AddNewUserUsingPOST')
			.mockReturnValue(of(<UserAddResponseModel> (dummyData)));
		jest.spyOn(cuiService, 'hide');
		component.onContinue();
		fixture.detectChanges();
		expect(service.AddNewUserUsingPOST)
			.toHaveBeenCalled();
		expect(component.isLoading)
			.toBeFalsy();
		expect(component.addUserResponse)
			.toBe(dummyData);
		expect(cuiService.hide)
			.toHaveBeenCalledTimes(1);
	});

	it('alert to be visible on failure next', () => {
		const dummyData: UserAddResponseModel = {
			data : [{ status: 500 }],
			status : 500,
		};
		jest.spyOn(service, 'AddNewUserUsingPOST')
			.mockReturnValue(of(<UserAddResponseModel> (dummyData)));
		component.onContinue();
		fixture.detectChanges();
		expect(service.AddNewUserUsingPOST)
			.toHaveBeenCalled();
		expect(component.isLoading)
			.toBeFalsy();
		expect(component.addUserResponse)
			.toBe(dummyData);
		expect(component.alert.visible)
			.toBeTruthy();
	});

	it('alert to be visible on invalid credentials next', () => {
		const dummyData: UserAddResponseModel = {
			status : 500,
		};
		jest.spyOn(service, 'AddNewUserUsingPOST')
			.mockReturnValue(of(<UserAddResponseModel> (dummyData)));
		component.onContinue();
		fixture.detectChanges();
		expect(service.AddNewUserUsingPOST)
			.toHaveBeenCalled();
		expect(component.isLoading)
			.toBeFalsy();
		expect(component.addUserResponse)
			.toBe(dummyData);
		expect(component.alert.visible)
			.toBeTruthy();
	});

});
