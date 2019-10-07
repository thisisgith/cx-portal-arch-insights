import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AssetTableComponent } from './asset-table.component';
import { AssetTableModule } from './asset-table.module';

describe('AdminAssetsTableComponent', () => {
	let component: AssetTableComponent;
	let fixture: ComponentFixture<AssetTableComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetTableModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetTableComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
		component.ngOnDestroy();
	});
});
