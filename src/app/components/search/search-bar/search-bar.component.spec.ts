import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

import { of } from 'rxjs';

import { SearchBarComponent } from './search-bar.component';
import { SearchBarModule } from './search-bar.module';
import { SearchService } from '@services';
import { SearchScenarios } from '@mock';
import { SearchEnum } from '@interfaces';

/** Mock typeahead response */
const mockResponse = SearchScenarios[1].scenarios.GET[0].response.body;

describe('SearchBarComponent', () => {
	let component: SearchBarComponent;
	let fixture: ComponentFixture<SearchBarComponent>;
	let service: SearchService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SearchBarModule,
				HttpClientTestingModule,
			],
		});
	});

	beforeEach(() => {
		service = TestBed.get(SearchService);
		fixture = TestBed.createComponent(SearchBarComponent);
		component = fixture.componentInstance;
		spyOn(component.searchChange, 'emit');
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

	it('should call typahead search', fakeAsync(() => {
		spyOn(service, 'fetchTypeahead')
			.and
			.returnValue(of(mockResponse));
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test1';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		tick(300);
		expect(service.fetchTypeahead)
			.toHaveBeenCalledWith({
				bizcontext: 'ENT',
				h: 7,
				locale: 'enus',
				q: 'Test1',
			});
	}));

	it('should show no options on empty search', fakeAsync(() => {
		spyOn(service, 'fetchTypeahead')
			.and
			.returnValue(of({ }));
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test1';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		tick(300);
		fixture.detectChanges();
		expect(component.typeaheadItems)
			.toEqual(null);
	}));

	it('should show options after typing', fakeAsync(() => {
		spyOn(service, 'fetchTypeahead')
			.and
			.returnValue(of(mockResponse));
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		tick(300);
		fixture.detectChanges();
		const dropdown = fixture.debugElement.query(By.css('.dropdown'));
		expect(dropdown)
			.toBeTruthy();
	}));

	it('should hide options with empty text search', fakeAsync(() => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.value = 'Test';
		input.nativeElement.dispatchEvent(new Event('input'));
		input.nativeElement.value = '';
		input.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();
		tick(300);
		const dropdown = fixture.debugElement.query(By.css('.dropdown'));
		expect(dropdown)
			.toBeFalsy();
	}));

	it('should select on Enter', fakeAsync(() => {
		spyOn(component, 'onSearchSelect');
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		fixture.detectChanges();
		const event = new KeyboardEvent('keyup', {
			key: 'Enter',
		});
		document.dispatchEvent(event);
		expect(component.onSearchSelect)
			.toHaveBeenCalled();
	}));

	it('should select on pressing enter on a typeahead option', fakeAsync(() => {
		spyOn(component, 'onSearchSelect');
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		fixture.detectChanges();
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		fixture.detectChanges();
		let event = new KeyboardEvent('keyup', {
			key: 'ArrowDown',
		});
		component.keyHandler(event);
		fixture.detectChanges();
		event = new KeyboardEvent('keyup', {
			key: 'Enter',
		});
		component.keyHandler(event);
		expect(component.onSearchSelect)
			.toHaveBeenCalled();
	}));

	it('should select on clicking a typeahead option', fakeAsync(() => {
		spyOn(component, 'clickHandler');
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		fixture.detectChanges();
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		fixture.detectChanges();
		const event = new KeyboardEvent('keyup', {
			key: 'ArrowDown',
		});
		component.keyHandler(event);
		fixture.detectChanges();
		const firstOption = fixture.debugElement.queryAll(By.css('a'))[0];
		firstOption.nativeElement.click();
		tick(300);
		expect(component.clickHandler)
			.toHaveBeenCalled();
	}));

	it('should highlight first option on arrow press', () => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		fixture.detectChanges();
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		fixture.detectChanges();
		const event = new KeyboardEvent('keyup', {
			key: 'ArrowDown',
		});
		component.keyHandler(event);
		fixture.detectChanges();
		const firstOption = fixture.debugElement.queryAll(By.css('a'))[0];
		expect(firstOption.classes['keyboard-hover'])
			.toBeTruthy();
	});

	it('should re-highlight after arrow up', () => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		fixture.detectChanges();
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		fixture.detectChanges();
		let event = new KeyboardEvent('keyup', {
			key: 'ArrowDown',
		});
		component.keyHandler(event);
		component.keyHandler(event);
		event = new KeyboardEvent('keyup', {
			key: 'ArrowUp',
		});
		component.keyHandler(event);
		fixture.detectChanges();
		const firstOption = fixture.debugElement.queryAll(By.css('a'))[0];
		expect(firstOption.classes['keyboard-hover'])
			.toBeTruthy();
	});

	it('should not highlight on arrow up or down if not focused', () => {
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		const event = new KeyboardEvent('keyup', {
			key: 'ArrowDown',
		});
		component.keyHandler(event);
		expect(component.typeaheadItems.find(item => item.keyHover))
			.toBeUndefined();
	});

	it('should not allow the key hover to go out of bounds', () => {
		const input = fixture.debugElement.query(By.css('input'));
		input.nativeElement.dispatchEvent(new Event('focus'));
		fixture.detectChanges();
		component.searchText = 'Test';
		component.typeaheadItems = [{
			name: 'Item1',
		}, {
			name: 'Item2',
		}];
		fixture.detectChanges();
		const event = new KeyboardEvent('keyup', {
			key: 'ArrowUp',
		});
		expect(component.keyHoverIndex)
			.toBe(-1);
		component.keyHandler(event);
		expect(component.keyHoverIndex)
			.toBe(-1);
	});

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
				type: {
					name: SearchEnum.case,
					value: '600000000',
				},
			});
	});

	it('should emit an rma selection', () => {
		component.onSearchSelect('800000000'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: '800000000',
				text: '800000000',
				type: {
					name: SearchEnum.rma,
					value: '800000000',
				},
			});
	});

	it('should emit a contract selection', () => {
		component.onSearchSelect('230000000'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: 'contract',
				text: '230000000',
				type: {
					name: SearchEnum.contract,
					value: '230000000',
				},
			});
	});

	it('should emit a sn selection', () => {
		component.onSearchSelect('1234'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: '1234',
				text: '1234',
				type: {
					name: SearchEnum.sn,
					value: '1234',
				},
			});
	});

	it('should emit a default selection', () => {
		component.onSearchSelect('Some value with spaces'); // RMA num
		expect(component.searchChange.emit)
			.toHaveBeenCalledWith({
				generalSearch: 'Some value with spaces',
				text: 'Some value with spaces',
				type: {
					name: SearchEnum.default,
				},
			});
	});

});
