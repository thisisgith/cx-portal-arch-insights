import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPracticesComponent } from './best-practices.component';
import { BestPracticesModule } from './best-practices.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OptimalSoftwareVersionComponent } from './osv/osv.component';
import { ArchitectureComponent } from './architecture/architecture.component';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { OptimalSoftwareVersionModule } from './osv/osv.module';
import { ArchitectureModule } from './architecture/architecture.module';
import * as _ from 'lodash-es';
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

describe('BestPracticesComponent', () => {
	let component: BestPracticesComponent;
	let fixture: ComponentFixture<BestPracticesComponent>;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				OptimalSoftwareVersionModule,
				HttpClientTestingModule,
				ArchitectureModule,
				RouterTestingModule.withRoutes([
					{
						path: 'solution/best-practices/optimal-software-version',
						component: OptimalSoftwareVersionComponent,
					},
					{
						path: 'solution/best-practices/architecture',
						component: ArchitectureComponent,
					},
				]),
				BestPracticesModule,
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
		fixture = TestBed.createComponent(BestPracticesComponent);
		component = fixture.componentInstance;
		router = fixture.debugElement.injector.get(Router);
		router.navigate(['/solution/best-practices/optimal-software-version']);
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	xit('should change the active tab when the route changes', () => {
		fixture.detectChanges();
		expect(component.selectedSubModule.route)
			.toEqual('/solution/best-practices/optimal-software-version');

		router.navigate(['/solution/best-practices/architecture']);

		fixture.detectChanges();

		expect(component.selectedSubModule.route)
			.toEqual('/solution/best-practices/architecture');
	});

	it('should change the selected facet', () => {
		fixture.detectChanges();

		// expect(component.selectedSubModule.route)
		// 	.toEqual('/solution/best-practices/optimal-software-version');

		const architectureSubModule = _.find(component.subModules, {
			route: '/solution/best-practices/architecture',
		});

		component.selectSubModule(architectureSubModule);

		fixture.detectChanges();

		expect(component.selectedSubModule)
			.toEqual(architectureSubModule);
	});
});
