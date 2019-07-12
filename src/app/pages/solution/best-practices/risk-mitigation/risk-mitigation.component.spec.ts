import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskMigitaionComponent } from './risk-mitigation.component';
import { RiskMitigationModule } from './risk-mitigation.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SecurityComponent', () => {
	let component: RiskMigitaionComponent;
	let fixture: ComponentFixture<RiskMigitaionComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				RiskMitigationModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RiskMigitaionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
