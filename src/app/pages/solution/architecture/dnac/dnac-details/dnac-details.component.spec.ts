import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnacDetailsComponent } from './dnac-details.component';
import { DnacDetailsModule } from './dnac-details.module';

describe('DnacDetailsComponent', () => {
	let component: DnacDetailsComponent;
	let fixture: ComponentFixture<DnacDetailsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DnacDetailsModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DnacDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
