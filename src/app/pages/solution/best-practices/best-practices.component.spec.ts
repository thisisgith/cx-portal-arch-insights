import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPracticesComponent } from './best-practices.component';
import { BestPracticesModule } from './best-practices.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AdvisoriesComponent', () => {
	let component: BestPracticesComponent;
	let fixture: ComponentFixture<BestPracticesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				BestPracticesModule,
				HttpClientTestingModule,
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
