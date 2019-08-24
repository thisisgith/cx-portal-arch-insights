import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftwareGroupDetailComponent } from './software-group-detail.component';
import { SoftwareGroupDetailModule } from './software-group-detail.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SoftwareGroupDetailComponent', () => {
	let component: SoftwareGroupDetailComponent;
	let fixture: ComponentFixture<SoftwareGroupDetailComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareGroupDetailModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SoftwareGroupDetailComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
