import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetDetailsComponent } from './asset-details.component';
import { AssetDetailsModule } from './asset-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
	user,
	MockAssetsData,
} from '@mock';
import { RouterTestingModule } from '@angular/router/testing';
import { UserResolve } from '@utilities';
import { of } from 'rxjs';

describe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;
	let userResolve: UserResolve;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				UserResolve,
			],
		})
		.compileComponents();

		userResolve = TestBed.get(UserResolve);
	}));

	beforeEach(() => {
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of(user.info.customerId));

		fixture = TestBed.createComponent(AssetDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit on panel close', done => {
		component.asset = MockAssetsData[0];

		component.close
		.subscribe(closeVar => {
			expect(closeVar)
				.toBeTruthy();

			expect(component.asset)
				.toBeNull();

			done();
		});

		fixture.detectChanges();

		expect(component.asset)
			.toEqual(MockAssetsData[0]);

		component.onPanelClose();
	});

	it('should resolve a customerId', done => {
		fixture.whenStable()
		.then(() => {
			expect(component.customerId)
				.toEqual(user.info.customerId);

			done();
		});
	});
});
