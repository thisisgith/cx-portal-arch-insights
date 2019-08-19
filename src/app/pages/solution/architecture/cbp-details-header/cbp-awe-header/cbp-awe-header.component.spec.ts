import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpAweHeaderComponent } from './cbp-awe-header.component';
 import { CbpAweHeaderModule } from './cbp-awe-header.module';

describe('CbpAweHeaderComponent', () => {
	let component: CbpAweHeaderComponent;
	let fixture: ComponentFixture<CbpAweHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			 imports: [CbpAweHeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpAweHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
