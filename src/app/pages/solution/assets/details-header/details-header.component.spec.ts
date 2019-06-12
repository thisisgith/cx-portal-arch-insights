import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsHeaderComponent } from './details-header.component';
import { DetailsHeaderModule } from './details-header.module';

describe('DetailsHeaderComponent', () => {
	let component: DetailsHeaderComponent;
	let fixture: ComponentFixture<DetailsHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [DetailsHeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
