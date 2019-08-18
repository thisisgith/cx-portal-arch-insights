import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrashHistoryComponent } from './crash-history.component';
import { CrashHistoryModule } from './crash-history.module';

describe('CrashHistoryComponent', () => {
	let component: CrashHistoryComponent;
	let fixture: ComponentFixture<CrashHistoryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [CrashHistoryModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CrashHistoryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
