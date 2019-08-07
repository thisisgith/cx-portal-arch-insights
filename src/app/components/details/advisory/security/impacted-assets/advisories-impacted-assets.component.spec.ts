import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisoriesImpactedAssetsComponent } from './advisories-impacted-assets.component';
import { AdvisoriesImpactedAssetsModule } from './advisories-impacted-assets.module';

describe('AdvisoriesImpactedAssetsComponent', () => {
	let component: AdvisoriesImpactedAssetsComponent;
	let fixture: ComponentFixture<AdvisoriesImpactedAssetsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AdvisoriesImpactedAssetsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdvisoriesImpactedAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
