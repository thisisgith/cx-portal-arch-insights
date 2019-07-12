import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPracticesComponent } from './best-practices.component';
import { BestPracticesModule } from './best-practices.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SecurityComponent', () => {
	let component: BestPracticesComponent;
	let fixture: ComponentFixture<BestPracticesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BestPracticesModule,
				HttpClientTestingModule,
				RouterTestingModule.withRoutes([]),
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BestPracticesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
