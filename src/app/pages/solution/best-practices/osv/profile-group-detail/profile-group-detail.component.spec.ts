import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileGroupDetailComponent } from './profile-group-detail.component';
import { ProfileGroupDetailModule } from './profile-group-detail.module';

describe('ProfileGroupDetailComponent', () => {
	let component: ProfileGroupDetailComponent;
	let fixture: ComponentFixture<ProfileGroupDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ProfileGroupDetailModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ProfileGroupDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
