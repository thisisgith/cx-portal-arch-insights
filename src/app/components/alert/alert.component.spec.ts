import { DebugElement } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';
import { AlertModule } from './alert.module';
import { environment } from '../../../environments/environment';

describe('AlertComponent', () => {
	let component: AlertComponent;
	let fixture: ComponentFixture<AlertComponent>;
	let de: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [AlertModule],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AlertComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should hide', fakeAsync(() => {
		de = fixture.debugElement.query(By.css('.icon-close'));
		de.triggerEventHandler('click', null);
		fixture.detectChanges();
		tick(300);
		de = fixture.debugElement.query(By.css('.alert-wrapper'));
		expect(de.styles.height)
			.toBe('0px');
	}));
});
