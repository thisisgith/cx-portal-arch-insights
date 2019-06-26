import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';

import { GeneralSearchComponent } from './general-search.component';
import { GeneralSearchModule } from './general-search.module';
import { SearchScenarios } from '@mock';
import { CDCSearchResponse, GlobalSearchResponse, SearchService } from '@cui-x/sdp-api';

describe('GeneralSearchComponent', () => {
	let component: GeneralSearchComponent;
	let service: SearchService;
	let fixture: ComponentFixture<GeneralSearchComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				GeneralSearchModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(SearchService);
		spyOn(service, 'directCDCSearch')
			.and
			.returnValue(
				of(<CDCSearchResponse> (SearchScenarios[0].scenarios.POST[0].response.body)),
			);
		spyOn(service, 'allSearch')
			.and
			.returnValue(
				of(<GlobalSearchResponse> (SearchScenarios[2].scenarios.POST[0].response.body)),
			);
		fixture = TestBed.createComponent(GeneralSearchComponent);
		component = fixture.componentInstance;
		component.query = { query: 'query1' };
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		component.query = { query: 'query2' };
		fixture.detectChanges();
		expect(service.directCDCSearch)
			.toHaveBeenCalled();
		expect(service.allSearch)
			.toHaveBeenCalled();
	});

	it('should load more', fakeAsync(() => {
		tick(1000);
		fixture.detectChanges();
		const button = fixture.debugElement.query(By.css('button'));
		button.nativeElement.click();
		tick();
		fixture.detectChanges();
		expect(service.directCDCSearch)
			.toHaveBeenCalledTimes(2);
	}));
});
