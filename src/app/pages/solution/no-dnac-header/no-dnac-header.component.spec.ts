import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDNACHeaderComponent } from './no-dnac-header.component';
import { NoDNACHeaderModule } from './no-dnac-header.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { RouterTestingModule } from '@angular/router/testing';

fdescribe('NoDNACHeaderComponent', () => {
	let component: NoDNACHeaderComponent;
	let fixture: ComponentFixture<NoDNACHeaderComponent>;
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				NoDNACHeaderModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
			],
		})
			.compileComponents();		
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(NoDNACHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});	
});
