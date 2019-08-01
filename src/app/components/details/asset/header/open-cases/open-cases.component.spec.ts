import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OpenCasesComponent } from './open-cases.component';
import { OpenCasesModule } from './open-cases.module';

describe('OpenCasesComponent', () => {
	let component: OpenCasesComponent;
	let fixture: ComponentFixture<OpenCasesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				OpenCasesModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OpenCasesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should hide', () => {
		spyOn(component.close, 'emit');
		component.hide();
		fixture.detectChanges();
		expect(component.close.emit)
			.toHaveBeenCalled();
	});

	it('should navigate to the problem resolution case list', () => {
		spyOn(component.router, 'navigate')
			.and
			.returnValue(new Promise(() => true));
		component.serial = 'FOX1306GBAD';
		component.onClickCase('688296392');
		fixture.detectChanges();
		expect(component.router.navigate)
			.toHaveBeenCalledWith(
				['solution/resolution'],
				{ queryParams: { case: '688296392', serial: 'FOX1306GBAD' } },
			);
	});
});
