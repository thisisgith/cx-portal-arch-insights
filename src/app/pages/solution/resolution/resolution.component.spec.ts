import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ResolutionComponent } from './resolution.component';
import { ResolutionModule } from './resolution.module';

describe('ResolutionComponent', () => {
	let component: ResolutionComponent;
	let fixture: ComponentFixture<ResolutionComponent>;
	let httpMock: HttpTestingController;
	let injector: TestBed;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ResolutionModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
		injector = getTestBed();
		httpMock = injector.get(HttpTestingController);
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ResolutionComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	afterEach(() => {
		httpMock.verify();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
