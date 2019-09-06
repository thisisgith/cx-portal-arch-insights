import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CasesComponent } from './cases.component';
import { CasesModule } from './cases.module';
import { DebugElement } from '@angular/core';

describe('CasesComponent', () => {
	let component: CasesComponent;
	let fixture: ComponentFixture<CasesComponent>;
	let de: DebugElement;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [CasesModule],
		});
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(CasesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	describe('navigation', () => {
		it('should navigate to more info page', () => {
			component.showCasesPage('caseMoreInfo');
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#caseMoreInfo'));
			expect(de)
				.toBeTruthy();
		});

		it('should navigate to submit page', () => {
			component.showCasesPage('caseSubmit');
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#caseSubmit'));
			expect(de)
				.toBeTruthy();
		});

		it('should navigate to info', () => {
			component.showCasesPage('caseInfo');
			fixture.detectChanges();

			de = fixture.debugElement.query(By.css('#caseInfo'));
			expect(de)
				.toBeTruthy();
		});
	});
});
