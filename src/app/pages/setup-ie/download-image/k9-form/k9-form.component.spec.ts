import { configureTestSuite } from 'ng-bullet';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { K9FormComponent } from './k9-form.component';
import { K9FormModule } from './k9-form.module';

describe('K9FormComponent', () => {
	let component: K9FormComponent;
	let fixture: ComponentFixture<K9FormComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				K9FormModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(K9FormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit decline event', async(() => {
		const sub = component.onDecline.subscribe(() => {
			expect()
				.nothing();
			sub.unsubscribe();
		});
		component.decline();
	}));

	it('should emit accept event', async(() => {
		const sub = component.onAccept.subscribe(() => {
			expect()
				.nothing();
			sub.unsubscribe();
		});
		component.accept();
	}));

	it('should check for disabled', () => {
		component.acceptedSE = true;
		expect(component.isDisabled)
			.toBe(true);
		component.businessFn = 'gov';
		expect(component.isDisabled)
			.toBe(true);
		component.inCountry = 'Yes';
		expect(component.isDisabled)
			.toBe(false);
	});
});
