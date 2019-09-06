import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchModule } from './search.module';
import { CaseService } from '@cui-x/services';
import { CaseScenarios } from '@mock';
import { I18n } from '@cisco-ngx/cui-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { SearchEnum } from '@interfaces';

import * as enUSJson from '../../../assets/i18n/en-US.json';
import { of } from 'rxjs';

describe('SearchComponent', () => {
	let component: SearchComponent;
	let fixture: ComponentFixture<SearchComponent>;
	let caseService: CaseService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				SearchModule,
				RouterTestingModule.withRoutes([]),
			],
		});
	});

	beforeEach(() => {
		I18n.injectDictionary(enUSJson);

		fixture = TestBed.createComponent(SearchComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should be hidden', () => {
		expect(component.status.hidden)
			.toBeTruthy();
		const searchDiv = fixture.debugElement.query(By.css('.modal-container'));
		expect(searchDiv)
			.toBeFalsy();
	});

	it('should show up upon a selection', () => {
		component.onSearchChange({
			generalSearch: 'Test1',
			text: 'Test1',
			type: {
				name: SearchEnum.default,
			},
		});
		fixture.detectChanges();
		expect(component.status.hidden)
			.toBeFalsy();
		const searchDiv = fixture.debugElement.query(By.css('.modal-container'));
		expect(searchDiv)
			.toBeTruthy();
	});

	it('should set a searchContext of \'serialno\'', () => {
		component.onSearchChange({
			generalSearch: 'FTX16148509',
			text: 'FTX16148509',
			type: {
				name: SearchEnum.sn,
				value: 'FTX16148509',
			},
		});
		fixture.detectChanges();
		expect(component.searchContext)
			.toEqual('serialno');
	});

	it('should toggle general search with a searchString and searchContext', fakeAsync(() => {
		caseService = TestBed.get(CaseService);
		spyOn(caseService, 'fetchCaseDetails')
			.and
			.returnValue(of(CaseScenarios[0].scenarios.GET[0].response.body));
		component.onSearchChange({
			generalSearch: '688296392',
			text: '688296392',
			type: {
				name: SearchEnum.case,
				value: '688296392',
			},
		});
		tick(1000);
		fixture.detectChanges();
		expect(component.generalSearch)
			.toEqual({ query: 'FOC1544Y16T' });
		expect(component.searchContext)
			.toEqual('serialno');
	}));

	it('should show special search', () => {
		component.onSearchChange({
			generalSearch: '230000000', // Contract
			text: '230000000',
			type: {
				name: SearchEnum.contract,
				value: '230000000',
			},
		});
		fixture.detectChanges();
		component.onHide(false);
		fixture.detectChanges();
		const special = fixture.debugElement.query(By.css('#specialContainer'));
		expect(special.nativeElement.hidden)
			.toBe(false);
	});

	it('should hide special search', () => {
		component.onSearchChange({
			generalSearch: '230000000', // Contract
			text: '230000000',
			type: {
				name: SearchEnum.contract,
				value: '230000000',
			},
		});
		fixture.detectChanges();
		component.onHide(true);
		fixture.detectChanges();
		const special = fixture.debugElement.query(By.css('#specialContainer'));
		expect(special.nativeElement.hidden)
			.toBe(true);
	});

	it('should show general search', () => {
		component.onSearchChange({
			generalSearch: '230000000', // Contract
			text: '230000000',
			type: {
				name: SearchEnum.contract,
				value: '230000000',
			},
		});
		fixture.detectChanges();
		const general = fixture.debugElement.query(By.css('#generalContainer'));
		expect(general.nativeElement.hidden)
			.toBeFalsy();
	});

	it('should hide general search', () => {
		component.onSearchChange({
			generalSearch: '230000000', // Contract
			text: '230000000',
			type: {
				name: SearchEnum.contract,
				value: '230000000',
			},
		});
		fixture.detectChanges();
		component.toggleGeneralSearch({
			hide: true,
		});
		fixture.detectChanges();
		const general = fixture.debugElement.query(By.css('#generalContainer'));
		expect(general.nativeElement.hidden)
			.toBeTruthy();
	});

	it('should close', () => {
		component.onSearchChange({
			generalSearch: 'Test1',
			text: 'Test1',
			type: {
				name: SearchEnum.default,
			},
		});
		fixture.detectChanges();
		expect(component.status.hidden)
			.toBeFalsy();
		const closeButton = fixture.debugElement.query(By.css('.modal__close')).nativeElement;
		closeButton.click();
		fixture.detectChanges();
		expect(component.status.hidden)
			.toBeTruthy();
	});

});
