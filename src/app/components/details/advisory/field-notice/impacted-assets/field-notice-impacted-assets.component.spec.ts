import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldNoticeImpactedAssetsComponent } from './field-notice-impacted-assets.component';
import { FieldNoticeImpactedAssetsModule } from './field-notice-impacted-assets.module';

describe('FieldNoticeImpactedAssetsComponent', () => {
	let component: FieldNoticeImpactedAssetsComponent;
	let fixture: ComponentFixture<FieldNoticeImpactedAssetsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FieldNoticeImpactedAssetsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FieldNoticeImpactedAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
