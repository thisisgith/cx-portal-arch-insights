import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AssetGridComponent } from './asset-grid.component';
import { AssetGridModule } from './asset-grid.module';

describe('AdminAssetsGridComponent', () => {
	let component: AssetGridComponent;
	let fixture: ComponentFixture<AssetGridComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetGridModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
		component.ngOnDestroy();
	});
});
