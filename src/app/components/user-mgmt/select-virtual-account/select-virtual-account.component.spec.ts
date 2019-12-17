import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { SelectVirtualAccountComponent } from './select-virtual-account.component';
import { SelectVirtualAccountModule } from './select-virtual-account.module';
import { environment } from '@environment';
import { RoleDetails } from '@sdp-api';

describe('SelectVirtualAccountComponent', () => {
	let component: SelectVirtualAccountComponent;
	let fixture: ComponentFixture<SelectVirtualAccountComponent>;
	// let de: DebugElement;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				SelectVirtualAccountModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SelectVirtualAccountComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		component.clickout(new MouseEvent('click'));
		component.toggleExpanded();
		expect(component)
			.toBeTruthy();
	});

	it('handle click when clicked on same role', () => {
		const dummyData: RoleDetails = {
			role: 'test',
			roleDescription: 'test',
			roleDisplayName: 'test',
			tenant: 'test',
			type_1: 'test',
			value_1: 'test',
		};
		component.roleName = 'test';
		component.handleClick(dummyData);
		expect.anything();
	});
});
