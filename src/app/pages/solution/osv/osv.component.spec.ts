import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsvComponent } from './osv.component';
import { OsvModule } from './osv.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OsvComponent', () => {
	let component: OsvComponent;
	let fixture: ComponentFixture<OsvComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				OsvModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OsvComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
