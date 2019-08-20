import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpTbdComponent } from './cbp-tbd.component';
import { CbpTbdModule } from './cbp-tbd.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CbpTbdComponent', () => {
	let component: CbpTbdComponent;
	let fixture: ComponentFixture<CbpTbdComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpTbdModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CbpTbdComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
