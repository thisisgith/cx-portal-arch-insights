import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwarProfileDetailComponent } from './software-profile-detail.component';
import { SoftwareProfileDetailModule } from './software-profile-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SoftwarProfileDetailComponent', () => {
	let component: SoftwarProfileDetailComponent;
	let fixture: ComponentFixture<SoftwarProfileDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareProfileDetailModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwarProfileDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
