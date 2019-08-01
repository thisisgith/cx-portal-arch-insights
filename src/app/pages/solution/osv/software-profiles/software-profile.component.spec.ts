import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareProfilesComponent } from './software-profile.component';
import { SoftwareProfilesModule } from './software-profile.module';

describe('SoftwareProfilesComponent', () => {
	let component: SoftwareProfilesComponent;
	let fixture: ComponentFixture<SoftwareProfilesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SoftwareProfilesModule],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareProfilesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
