import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedRmaComponent } from './related-rma.component';
import { RelatedRmaModule } from './related-rma.module';

describe('RelatedRmaComponent', () => {
	let component: RelatedRmaComponent;
	let fixture: ComponentFixture<RelatedRmaComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [RelatedRmaModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RelatedRmaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
