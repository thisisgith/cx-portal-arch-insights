import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';

describe('SolutionComponent', () => {
	let component: SolutionComponent;
	let fixture: ComponentFixture<SolutionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [SolutionModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SolutionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
