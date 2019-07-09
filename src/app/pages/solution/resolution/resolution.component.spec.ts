import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
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

	it('should call case list', () => {
		expect(service.read)
			.toHaveBeenCalled();
	});
});
