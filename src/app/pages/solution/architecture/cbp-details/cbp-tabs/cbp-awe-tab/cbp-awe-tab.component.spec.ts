import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpAweTabComponent } from './cbp-awe-tab.component';
import { CbpAweTabModule } from './cbp-awe-tab.module';

describe('CbpAweTabComponent', () => {
	let component: CbpAweTabComponent;
	let fixture: ComponentFixture<CbpAweTabComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpAweTabModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpAweTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
