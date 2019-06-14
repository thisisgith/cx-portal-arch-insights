import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { SearchBarComponent } from './search-bar.component';
import { SearchBarModule } from './search-bar.module';

describe('SearchBarComponent', () => {
	let component: SearchBarComponent;
	let fixture: ComponentFixture<SearchBarComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SearchBarModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SearchBarComponent);
		component = fixture.componentInstance;
		spyOn(component, 'keyHandler');
		spyOn(component.searchChange, 'emit');
		component.items = [
			{
				name: 'Test1',
			},
			{
				name: 'Test2',
			},
		];
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should not show typeahead immediately', () => {
		const dropdown = fixture.debugElement.query(By.css('.dropdown'));
		expect(dropdown)
			.toBeFalsy();
	});

	it('should show options after typing', () => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		const dropdown = fixture.debugElement.query(By.css('.dropdown'));
		expect(dropdown)
			.toBeTruthy();
	});

	it('should hide options with empty text search', () => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test';
		input.nativeElement.dispatchEvent(new Event('input'));
		input.nativeElement.value = '';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		const dropdown = fixture.debugElement.query(By.css('.dropdown'));
		expect(dropdown)
			.toBeFalsy();
	});

	it('should filter options', fakeAsync(() => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test1';
		input.nativeElement.dispatchEvent(new Event('input'));
		tick();
		fixture.detectChanges();
		expect(component.typeaheadItems.length)
			.toEqual(1);
	}));

	it('should select on Enter', fakeAsync(() => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		input.nativeElement.value = 'Test1';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		const event = new KeyboardEvent('keyup', {
			key: 'Enter',
		});
		document.dispatchEvent(event);
		tick();
		expect(component.keyHandler)
			.toHaveBeenCalled();
	}));

	it('should not emit on empty selection', () => {
		component.onSearchSelect(''); // casenum
		expect(component.searchChange.emit)
			.toHaveBeenCalledTimes(0);
	});

	it('should emit a case selection', () => {
		component.onSearchSelect('600000000'); // casenum
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: '600000000',
				text: '600000000',
				type: 'case',
			});
	});

	it('should emit an rma selection', () => {
		component.onSearchSelect('800000000'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: '800000000',
				text: '800000000',
				type: 'rma',
			});
	});

	it('should emit a contract selection', () => {
		component.onSearchSelect('23000000'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: 'contract',
				text: '23000000',
				type: 'contract',
			});
	});

	it('should emit a sn selection', () => {
		component.onSearchSelect('1234'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: '1234',
				text: '1234',
				type: 'sn',
			});
	});

	it('should emit a default selection', () => {
		component.onSearchSelect('Some value with spaces'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: 'Some value with spaces',
				text: 'Some value with spaces',
				type: 'default',
			});
	});
});
