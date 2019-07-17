import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsSoftwareComponent } from './assets-software.component';
import { AssetsSoftwareModule } from './assets-software.module';

describe('AssetsSoftwareComponent', () => {
	let component: AssetsSoftwareComponent;
	let fixture: ComponentFixture<AssetsSoftwareComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AssetsSoftwareModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsSoftwareComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
