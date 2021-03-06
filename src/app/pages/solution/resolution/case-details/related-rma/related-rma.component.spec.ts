import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { RelatedRmaComponent } from './related-rma.component';
import { RelatedRmaModule } from './related-rma.module';
import { By } from '@angular/platform-browser';
describe('RelatedRmaComponent', () => {
	let component: RelatedRmaComponent;
	let fixture: ComponentFixture<RelatedRmaComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				RelatedRmaModule,
				RouterTestingModule,
			],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(RelatedRmaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should build table on init', () => {
		jest.spyOn(component, 'buildTable');
		component.ngOnInit();
		expect(component.buildTable)
			.toHaveBeenCalled();
	});

	it('should hide', fakeAsync(() => {
		jest.spyOn(component.close, 'emit');
		const button = fixture.debugElement.query(By.css('[data-auto-id="close"]'));
		button.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(component.close.emit)
			.toHaveBeenCalled();
	}));

	it('should display loader if firstChange', () => {
		component.ngOnChanges({
			rmaRecords: {
				currentValue: [],
				firstChange: true,
				isFirstChange: () => false,
				previousValue: { },
			},
		});
		fixture.detectChanges();
		expect(component.loading)
			.toEqual(true);
	});

	it('should not display loader if its not firstChange or rma record exists', () => {
		component.ngOnChanges({
			rmaRecords: {
				currentValue: [{ }],
				firstChange: false,
				isFirstChange: () => false,
				previousValue: { },
			},
		});
		fixture.detectChanges();
		expect(component.loading)
			.toEqual(false);
	});

});
