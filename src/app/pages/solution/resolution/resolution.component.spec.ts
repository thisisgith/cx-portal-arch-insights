import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { ResolutionComponent } from './resolution.component';
import { ResolutionModule } from './resolution.module';
import { CaseService } from '@cui-x/services';

describe('ResolutionComponent', () => {
	let component: ResolutionComponent;
	let fixture: ComponentFixture<ResolutionComponent>;
	let service: CaseService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ResolutionModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(CaseService);
		spyOn(service, 'read')
			.and
			.returnValue(of([]));
		fixture = TestBed.createComponent(ResolutionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call case list on init', () => {
		expect(service.read)
			.toHaveBeenCalled();
	});

	it('should refresh on sort', () => {
		component.onTableSortingChanged({
			key: 'Key1',
			value: 'Value1',
		});
		expect(service.read)
			.toHaveBeenCalledTimes(2);
	});

	it('should refresh on page change', () => {
		component.onPagerUpdated({ page: 2 });
		expect(service.read)
			.toHaveBeenCalledTimes(2);
	});

	it('should show invalid input on bad casenum', fakeAsync(() => {
		const input = fixture.debugElement.query(By.css('#input-type-search'));
		const form = fixture.debugElement.query(By.css('form'));
		const el = input.nativeElement;
		el.value = 'abc';
		el.dispatchEvent(new Event('input'));
		form.nativeElement
			.dispatchEvent(new Event('submit'));
		tick();
		fixture.detectChanges();
		// Expect only the 1 initial search on page load
		expect(service.read)
			.toHaveBeenCalledTimes(1);
		expect(component.isSearchCaseFormInvalid)
			.toBeTruthy();
	}));

	it('should submit valid casenum search', () => {
		const input = fixture.debugElement.query(By.css('input'));
		const form = fixture.debugElement.query(By.css('form'));
		const el = input.nativeElement;
		el.value = '900000000';
		el.dispatchEvent(new Event('input'));
		form.nativeElement
			.dispatchEvent(new Event('submit'));
		fixture.detectChanges();
		// Expect it to refresh again
		expect(service.read)
			.toHaveBeenCalledTimes(2);
		expect(component.isSearchCaseFormInvalid)
			.toBeFalsy();
	});

	it('should give the correct severity color', () => {
		expect(component.getSeverityColor('1'))
			.toEqual('danger');
		expect(component.getSeverityColor('2'))
			.toEqual('warning');
		expect(component.getSeverityColor('3'))
			.toEqual('warning-alt');
		expect(component.getSeverityColor('4'))
			.toEqual('info');
		expect(component.getSeverityColor('42'))
			.toEqual(undefined);
	});
});
