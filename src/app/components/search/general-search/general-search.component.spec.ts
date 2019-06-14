import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { GeneralSearchComponent } from './general-search.component';
import { GeneralSearchModule } from './general-search.module';
import { SearchScenarios } from '@mock';
import { SearchService } from '@cui-x/sdp-api';

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
			.returnValue(of(SearchScenarios[0].scenarios.POST[0].response.body));
		fixture = TestBed.createComponent(GeneralSearchComponent);
		component = fixture.componentInstance;
		component.query = 'query1';
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should refresh on query change', () => {
		component.query = 'query2';
		fixture.detectChanges();
		expect(service.directCDCSearch)
			.toHaveBeenCalled();
	});
});
