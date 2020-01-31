import { configureTestSuite } from 'ng-bullet';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {
	ComponentFixture,
	TestBed,
} from '@angular/core/testing';
import { UserMgmtComponent } from './user-mgmt.component';
import { UserMgmtModule } from './user-mgmt.module';
import { of } from 'rxjs';
import { environment } from '@environment';

describe('UserMgmtComponent', () => {
	let component: UserMgmtComponent;
	let fixture: ComponentFixture<UserMgmtComponent>;
	// let de: DebugElement;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				RouterTestingModule,
				UserMgmtModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(UserMgmtComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should run functions', () => {
		component.setSort('companyName');
		component.onUpdateClick();
		component.onAddUser();
		component.handleUserDropdownSelection({ label: 'test' }, { });
		component.changeRole(of(null));
		expect(component.sortProps.column)
			.toBe('companyName');
		component.setSort('companyName');
		fixture.detectChanges();
		expect(component.sortProps.dir)
			.toBe('desc');
		component.setSort('companyName');
		expect(component.sortProps.dir)
			.toBe('asc');
	});

});
