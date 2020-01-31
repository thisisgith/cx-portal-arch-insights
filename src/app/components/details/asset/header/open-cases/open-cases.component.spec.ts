import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OpenCasesComponent } from './open-cases.component';
import { OpenCasesModule } from './open-cases.module';

describe('OpenCasesComponent', () => {
	let component: OpenCasesComponent;
	let fixture: ComponentFixture<OpenCasesComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				OpenCasesModule,
				RouterTestingModule,
			],
		});
	});

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
		jest.spyOn(component.close, 'emit');
		component.hide();
		fixture.detectChanges();
		expect(component.close.emit)
			.toHaveBeenCalled();
	});

	it('should navigate to the problem resolution case list', () => {
		jest.spyOn(component.router, 'navigate')
			.mockReturnValue(new Promise(() => true));
		component.serial = 'FOX1306GBAD';
		component.onClickCase('688296392');
		fixture.detectChanges();
		expect(component.router.navigate)
			.toHaveBeenCalledWith(
				['solution/resolution'],
				{ queryParams: { case: '688296392', serialNumber: 'FOX1306GBAD' } },
			);
	});
});
