import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { SolutionComponent } from './solution.component';
import { SolutionModule } from './solution.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NavigationEnd, Router } from '@angular/router';
import { LifecycleComponent } from './lifecycle/lifecycle.component';
import { LifecycleModule } from './lifecycle/lifecycle.module';
import { HttpClientModule } from '@angular/common/http';
import { AssetsComponent } from './assets/assets.component';
import { AssetsModule } from './assets/assets.module';

import * as _ from 'lodash';

/**
 * MockRouter used to help show/hide the spinner
 */
class MockRouter {
	public subject = new Subject();
	public events = this.subject.asObservable();

	/**
	 * Mocking navigate from Router
	 * @param url The url to mock route to
	 */
	public navigate (url: string) {
		this.subject.next(new NavigationEnd(0, url, null));
	}
}

describe('SolutionComponent', () => {
	let component: SolutionComponent;
	let fixture: ComponentFixture<SolutionComponent>;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetsModule,
				HttpClientModule,
				LifecycleModule,
				RouterTestingModule.withRoutes([
					{ path: 'solution/lifecycle', component: LifecycleComponent },
					{ path: 'solution/lifecycle', component: AssetsComponent },
				]),
				SolutionModule,
			],
			providers: [
				{
					provide: Router,
					useClass: MockRouter,
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SolutionComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		router.navigate(['/solution/lifecycle']);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should change the active tab when the route changes', () => {
		expect(component.selectedFacet.route)
			.toEqual('/solution/lifecycle');

		router.navigate(['/solution/assets']);

		fixture.detectChanges();

		expect(component.selectedFacet.route)
			.toEqual('/solution/assets');
	});

	it('should change the selected facet', () => {
		expect(component.selectedFacet.route)
			.toEqual('/solution/lifecycle');

		const assetsFacet = _.find(component.facets, { route: '/solution/assets' });

		component.selectFacet(assetsFacet);

		fixture.detectChanges();

		expect(component.selectedFacet)
			.toEqual(assetsFacet);
	});

	it('should change the active solution', () => {
		expect(component.selectedSolution.key)
			.toEqual('ibn');

		component.changeSolution(component.solutions[1]);

		fixture.detectChanges();

		expect(component.selectedSolution.key)
			.toEqual('aci');
	});

	it('should change the active use case', () => {
		expect(component.selectedUseCase.key)
			.toEqual('assurance');

		component.changeUseCase(component.useCases.ibn[1]);

		fixture.detectChanges();

		expect(component.selectedUseCase.key)
			.toEqual('sd-access');
	});
});
