import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ResolutionComponent } from './resolution.component';
import { ResolutionModule } from './resolution.module';

describe('ResolutionComponent', () => {
	let component: ResolutionComponent;
	let fixture: ComponentFixture<ResolutionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ResolutionModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ResolutionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
