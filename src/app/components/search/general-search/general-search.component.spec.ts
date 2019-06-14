import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { GeneralSearchComponent } from './general-search.component';
import { GeneralSearchModule } from './general-search.module';
import { SearchService } from '@services';

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
		spyOn(service, 'search')
			.and
			.callThrough();
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
		expect(service.search)
			.toHaveBeenCalled();
	});
});
