import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileGroupsComponent } from './profile-groups.component';
import { ProfileGroupsModule } from './profile-groups.module';

describe('ProfileGroupsComponent', () => {
	let component: ProfileGroupsComponent;
	let fixture: ComponentFixture<ProfileGroupsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ProfileGroupsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileGroupsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
