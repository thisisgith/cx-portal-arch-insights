import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpHeaderComponent } from './cbp-header.component';
import { CbpHeaderModule } from './cbp-header.module';

describe('CbpHeaderComponent', () => {
	let component: CbpHeaderComponent;
	let fixture: ComponentFixture<CbpHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpHeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
