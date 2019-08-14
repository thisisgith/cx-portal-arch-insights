import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DnacListComponent } from './dnac-list.component';
import { DnacListModule } from './dnac-list.module';

describe('DnacListComponent', () => {
	let component: DnacListComponent;
	let fixture: ComponentFixture<DnacListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DnacListModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DnacListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
