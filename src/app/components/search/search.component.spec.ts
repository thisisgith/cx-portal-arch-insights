import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchComponent } from './search.component';
import { SearchModule } from './search.module';
import { I18n } from '@cisco-ngx/cui-utils';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

import * as enUSJson from '../../../assets/i18n/en-US.json';

describe('SearchComponent', () => {
	let component: SearchComponent;
	let fixture: ComponentFixture<SearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				HttpClientTestingModule,
				SearchModule,
				RouterTestingModule.withRoutes([]),
			],
		})
		.compileComponents();
	}));

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
			type: 'default',
		});
		fixture.detectChanges();
		expect(component.status.hidden)
			.toBeFalsy();
		const searchDiv = fixture.debugElement.query(By.css('.modal-container'));
		expect(searchDiv)
			.toBeTruthy();
	});

	it('should show special search', () => {
		component.onSearchChange({
			generalSearch: '23000000', // Contract
			text: '23000000',
			type: 'contract',
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
			generalSearch: '23000000', // Contract
			text: '23000000',
			type: 'contract',
		});
		fixture.detectChanges();
		component.onHide(true);
		fixture.detectChanges();
		const special = fixture.debugElement.query(By.css('#specialContainer'));
		expect(special.nativeElement.hidden)
			.toBe(true);
	});
});
