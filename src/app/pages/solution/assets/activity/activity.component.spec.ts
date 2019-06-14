import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssetActivityComponent } from './activity.component';
import { AssetActivityModule } from './activity.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AssetDetailsComponent', () => {
	let component: AssetActivityComponent;
	let fixture: ComponentFixture<AssetActivityComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetActivityModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetActivityComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	// TODO Add unit test for asset switching once API is written
});
