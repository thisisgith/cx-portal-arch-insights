import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';
import { RouterTestingModule } from '@angular/router/testing';
import { LifecycleComponent } from './lifecycle/lifecycle.component';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { HttpClientModule } from '@angular/common/http';

describe('SolutionComponent', () => {
	let component: SolutionComponent;
	let fixture: ComponentFixture<SolutionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientModule,
				LifecycleModule,
				RouterTestingModule.withRoutes([
					{ path: 'solution/lifecycle', component: LifecycleComponent },
				]),
				SolutionModule,
			],
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
