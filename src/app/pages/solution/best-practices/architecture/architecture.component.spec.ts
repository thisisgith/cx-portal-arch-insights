import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchitectureComponent } from './architecture.component';
import { ArchitectureModule } from './architecture.module';

describe('ArchitectureComponent', () => {
	let component: ArchitectureComponent;
	let fixture: ComponentFixture<ArchitectureComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [ArchitectureModule],
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
