import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnacDetailsHeaderComponent } from './dnac-details-header.component';
import { DnacDetailsHeaderModule } from './dnac-details-header.module';

describe('DnacDetailsHeaderComponent', () => {
	let component: DnacDetailsHeaderComponent;
	let fixture: ComponentFixture<DnacDetailsHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DnacDetailsHeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DnacDetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
