import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetDetailsComponent } from './asset-detail.component';
import { AssetDetailsModule } from './asset-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssetDetailsComponent', () => {
	let component: AssetDetailsComponent;
	let fixture: ComponentFixture<AssetDetailsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetDetailsModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetDetailsComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
