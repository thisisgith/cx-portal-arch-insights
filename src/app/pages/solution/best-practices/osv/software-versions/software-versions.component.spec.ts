import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareVersionsComponent } from './software-versions.component';
import { SoftwareVersionsModule } from './software-versions.module';

describe('SoftwareVersionsComponent', () => {
	let component: SoftwareVersionsComponent;
	let fixture: ComponentFixture<SoftwareVersionsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SoftwareVersionsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareVersionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
