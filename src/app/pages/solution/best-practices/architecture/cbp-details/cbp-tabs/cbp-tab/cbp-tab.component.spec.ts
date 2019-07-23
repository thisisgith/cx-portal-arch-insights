import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpTabComponent } from './cbp-tab.component';
import { CbpTabModule } from './cbp-tab.module';

describe('CbpTabComponent', () => {
	let component: CbpTabComponent;
	let fixture: ComponentFixture<CbpTabComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpTabModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpTabComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
