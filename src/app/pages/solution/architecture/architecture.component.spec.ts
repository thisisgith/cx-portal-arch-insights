import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureComponent } from './architecture.component';
import { ArchitectureModule } from './architecture.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArchitectureService } from '@sdp-api';
import { of } from 'rxjs';

describe('ArchitectureComponent', () => {
	let component: ArchitectureComponent;
	let fixture: ComponentFixture<ArchitectureComponent>;
	let service: ArchitectureService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ArchitectureModule,
				HttpClientTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		service = TestBed.get(ArchitectureService);
		spyOn(service, 'getExceptionsCount')
			.and
			.returnValue(of({ CBPRulesCount: 5000 }));
		spyOn(service, 'getAssetsExceptionsCount')
			.and
			.returnValue(of({ AssetsExceptionCount: 5000 }));
		fixture = TestBed.createComponent(ArchitectureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call exceptions count on init', () => {
		expect(service.getExceptionsCount)
			.toHaveBeenCalled();
	});

	it('should call assets exceptions count on init', () => {
		expect(service.getAssetsExceptionsCount)
			.toHaveBeenCalled();
	});
});
