import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsCardViewComponent } from './assets-card-view.component';
import { AssetsCardViewModule } from './assets-card-view.module';

describe('AssetsCardViewComponent', () => {
	let component: AssetsCardViewComponent;
	let fixture: ComponentFixture<AssetsCardViewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AssetsCardViewComponent],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetsCardViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
