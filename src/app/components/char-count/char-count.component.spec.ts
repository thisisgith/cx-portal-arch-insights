import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharCountComponent } from './char-count.component';
import { CharCountModule } from './char-count.module';

describe('CharCountComponent', () => {
	let component: CharCountComponent;
	let fixture: ComponentFixture<CharCountComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CharCountModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CharCountComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
