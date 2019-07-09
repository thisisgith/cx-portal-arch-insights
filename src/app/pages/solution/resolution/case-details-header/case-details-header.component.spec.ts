import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseDetailsHeaderComponent } from './case-details-header.component';
import { CaseDetailsHeaderModule } from './case-details-header.module';

describe('CaseDetailsHeaderComponent', () => {
	let component: CaseDetailsHeaderComponent;
	let fixture: ComponentFixture<CaseDetailsHeaderComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CaseDetailsHeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CaseDetailsHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should return the correct severity color', () => {
		expect(component.getSeverityColor('1'))
			.toEqual('danger');
		expect(component.getSeverityColor('2'))
			.toEqual('warning');
		expect(component.getSeverityColor('3'))
			.toEqual('warning-alt');
		expect(component.getSeverityColor('4'))
			.toEqual('info');
	});
});
