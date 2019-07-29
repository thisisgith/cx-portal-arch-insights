import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CommunitiesComponent } from './communities.component';
import { CommunitiesModule } from './communities.module';

describe('CommunitiesComponent', () => {
	let component: CommunitiesComponent;
	let fixture: ComponentFixture<CommunitiesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				CommunitiesModule,
				RouterTestingModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CommunitiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
