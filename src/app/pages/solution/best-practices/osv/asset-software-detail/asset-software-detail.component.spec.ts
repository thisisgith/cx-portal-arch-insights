import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetSoftwareDetailsComponent } from './asset-software-detail.component';
import { AssetSoftwareDetailsModule } from './asset-software-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssetSoftwareDetailsComponent', () => {
	let component: AssetSoftwareDetailsComponent;
	let fixture: ComponentFixture<AssetSoftwareDetailsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetSoftwareDetailsModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetSoftwareDetailsComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
