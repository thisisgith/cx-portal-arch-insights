import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharCountComponent } from './char-count.component';
import { CharCountModule } from './char-count.module';

describe('CharCountComponent', () => {
	let component: CharCountComponent;
	let fixture: ComponentFixture<CharCountComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CharCountModule],
		});
	});

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
