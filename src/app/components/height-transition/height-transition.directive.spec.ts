import { Component, DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HeightTransitionModule } from './height-transition.module';

/**
 * Test Component
 */
@Component({
	template: '<div ' +
	'id="target" ' +
	'heightTransition ' +
	'[heightTransitionExpanded]="expanded" ' +
	'>Test</div>',
})
class TestHeightTransition {
	public expanded: boolean;
}

describe('HeightTransitionDirective', () => {
	let component: TestHeightTransition;
	let fixture: ComponentFixture<TestHeightTransition>;
	let de: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestHeightTransition],
			imports: [HeightTransitionModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestHeightTransition);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should expand', () => {
		component.expanded = true;
		fixture.detectChanges();
		de = fixture.debugElement.query(By.css('#target'));
		expect(de.styles.height)
			.not
			.toBe('0px');
	});

	it('should collapse', fakeAsync(() => {
		component.expanded = true;
		fixture.detectChanges();
		de = fixture.debugElement.query(By.css('#target'));
		expect(de.styles.height)
			.not
			.toBe('0px');
		component.expanded = false;
		fixture.detectChanges();
		tick(300);
		de = fixture.debugElement.query(By.css('#target'));
		expect(de.styles.height)
			.toBe('0px');
	}));
});
