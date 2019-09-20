import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
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
import { DetailsPanelStackService } from '@services';

describe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;
	let userResolve: UserResolve;

	let detailsPanelStackService: DetailsPanelStackService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				UserResolve,
			],
		});
	});

	beforeEach(async(() => {

		userResolve = TestBed.get(UserResolve);
	}));

	beforeEach(() => {
		spyOn(userResolve, 'getCustomerId')
			.and
			.returnValue(of(user.info.customerId));
		detailsPanelStackService = TestBed.get(DetailsPanelStackService);
		fixture = TestBed.createComponent(AssetDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit on panel close', fakeAsync(() => {
		component.asset = MockAssetsData[0];

		component.close
		.subscribe(closeVar => {
			expect(closeVar)
				.toBeTruthy();

			expect(component.asset)
				.toBeNull();
		});

		expect(component.asset)
			.toEqual(MockAssetsData[0]);

		component.onPanelClose();
		tick();
	}));

	it('should resolve a customerId', done => {
		fixture.whenStable()
		.then(() => {
			expect(component.customerId)
				.toEqual(user.info.customerId);
			done();
		});
	});

	it('should handle on panel hidden', () => {
		const panelCloseSpy = spyOn(component, 'onAllPanelsClose');

		component.handleHidden(false);
		expect(panelCloseSpy)
			.not
			.toHaveBeenCalled();

		component.handleHidden(true);
		expect(panelCloseSpy)
			.toHaveBeenCalled();
	});

	it('should change assets', done => {
		component.asset = MockAssetsData[0];

		component.ngOnChanges({
			asset: {
				currentValue: MockAssetsData[0],
				firstChange: true,
				isFirstChange: () => true,
				previousValue: null,
			},
		});

		expect(component.asset.deviceName)
			.toEqual(MockAssetsData[0].deviceName);

		component.asset = MockAssetsData[1];

		component.ngOnChanges({
			asset: {
				currentValue: MockAssetsData[1],
				firstChange: false,
				isFirstChange: () => false,
				previousValue: MockAssetsData[0],
			},
		});

		fixture.whenStable()
		.then(() => {
			expect(component.asset.deviceName)
				.toEqual(MockAssetsData[1].deviceName);
			done();
		});
	});

	it('should pop panel on back', () => {
		spyOn(detailsPanelStackService, 'pop');

		component.onPanelBack();

		expect(detailsPanelStackService.pop)
			.toHaveBeenCalled();
	});

	it('should reset stack service', () => {
		spyOn(detailsPanelStackService, 'reset');

		component.onAllPanelsClose();

		expect(detailsPanelStackService.reset)
			.toHaveBeenCalled();
	});
});
