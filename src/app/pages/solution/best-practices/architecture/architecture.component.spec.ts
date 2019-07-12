import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureComponent } from './architecture.component';
import { ArchitectureModule } from './architecture.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SecurityComponent', () => {
	let component: ArchitectureComponent;
	let fixture: ComponentFixture<ArchitectureComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				ArchitectureModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ArchitectureComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
