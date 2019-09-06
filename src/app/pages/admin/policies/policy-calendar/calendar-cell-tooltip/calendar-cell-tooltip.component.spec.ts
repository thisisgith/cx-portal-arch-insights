import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

import { CalendarCellTooltipComponent  } from './calendar-cell-tooltip.component';
import { PoliciesModule } from '../../policies.module';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('PolicyCalendarTooltipComponent', () => {
	let component: CalendarCellTooltipComponent;
	let fixture: ComponentFixture<CalendarCellTooltipComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				PoliciesModule,
				RouterTestingModule,
			],
			providers: [DatePipe],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CalendarCellTooltipComponent);
		component = fixture.componentInstance;
		component.data = {
			isBlankCell: false,
			policies: [
				{
					createdDate: '2019-08-07T19:25:07.859',
					deviceCount: 1,
					policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
					policyType: 'SCAN',
					schedule: '0 7 * * *',
				},
				{
					createdDate: '2019-08-07T19:25:07.859',
					deviceCount: 1,
					policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
					policyType: 'COLLECTION',
					schedule: '0 30 23 21 * ?',
				},
				{
					createdDate: '2019-08-07T19:25:07.859',
					deviceCount: 1,
					policyId: '88477e54-195e-462d-9be2-a4351b2cbb94',
					policyType: 'IGNORE',
					schedule: '0 0 12 ? * 3',
				},
			],
		};
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
