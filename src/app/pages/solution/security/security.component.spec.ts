import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityComponent } from './security.component';
import { SecurityModule } from './security.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SecurityComponent', () => {
	let component: SecurityComponent;
	let fixture: ComponentFixture<SecurityComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SecurityModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(SecurityComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
