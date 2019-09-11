import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { K9DeclineComponent } from './k9-decline.component';
import { K9DeclineModule } from './k9-decline.module';

describe('K9DeclineComponent', () => {
	let component: K9DeclineComponent;
	let fixture: ComponentFixture<K9DeclineComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				K9DeclineModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(K9DeclineComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit cancel event', async(() => {
		const sub = component.onCancel.subscribe(() => {
			expect()
				.nothing();
			sub.unsubscribe();
		});
		component.cancel();
	}));

	it('should emit continue event', async(() => {
		const sub = component.onContinue.subscribe(() => {
			expect()
				.nothing();
			sub.unsubscribe();
		});
		component.continue();
	}));
});
