import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AssetToolbarComponent } from './asset-toolbar.component';
import { AssetToolbarModule } from './asset-toolbar.module';

import { AssetsState } from '../assets-state.service';

describe('AdminAssetsToolbarComponent', () => {
	let component: AssetToolbarComponent;
	let fixture: ComponentFixture<AssetToolbarComponent>;
	let state: AssetsState;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetToolbarModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();

		state = TestBed.get(AssetsState);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetToolbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
		component.ngOnDestroy();
	});

	it('should select a view', () => {
		component.selectView('grid');
		expect(state.view)
			.toBe('grid');
	});
});
