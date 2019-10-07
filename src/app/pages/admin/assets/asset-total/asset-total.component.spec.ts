import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AssetTotalComponent } from './asset-total.component';
import { AssetTotalModule } from './asset-total.module';

import { AssetsState } from '../assets-state.service';

describe('AdminAssetsTotalComponent', () => {
	let component: AssetTotalComponent;
	let fixture: ComponentFixture<AssetTotalComponent>;
	let state: AssetsState;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetTotalModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();

		state = TestBed.get(AssetsState);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetTotalComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		state.totalAssets = 100;
		expect(component)
			.toBeTruthy();
		component.ngOnDestroy();
	});
});
