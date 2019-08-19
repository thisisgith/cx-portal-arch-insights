import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbpRuleViolationComponent } from './cbp-rule-violation.component';
import { CbpRuleViolationModule } from './cbp-rule-violation.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('CbpRuleViolationComponent', () => {
	let component: CbpRuleViolationComponent;
	let fixture: ComponentFixture<CbpRuleViolationComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CbpRuleViolationModule,
				HttpClientTestingModule,
				RouterTestingModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getCBPSeverityList')
			.and
			.returnValue(of({ TotalCounts: 1000, BPRulesDetails: [] }));
		fixture = TestBed.createComponent(CbpRuleViolationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getCBPSeverityList on init', () => {
		component.getCBPRulesData();
		expect(service.getCBPSeverityList)
			.toHaveBeenCalled();
	});

	// it('should call build table on init', () => {
	// 	expect(component.buildTable)
	// 		.toHaveBeenCalled();
	// });
});
