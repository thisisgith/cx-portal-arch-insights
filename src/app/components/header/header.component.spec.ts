import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroMockService } from '@cui-x-views/mock';

import { HeaderComponent } from './header.component';
import { HeaderModule } from './header.module';

describe('HeaderComponent', () => {
	let component: HeaderComponent;
	let fixture: ComponentFixture<HeaderComponent>;
	let mockService: MicroMockService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [HeaderModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HeaderComponent);
		component = fixture.componentInstance;
		mockService = TestBed.get(MicroMockService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should provide a method for opening the the mock settings modal', () => {
		const promptMockSettingsSpy = spyOn(mockService, 'promptMockSettings')
			.and
			.callThrough();
		component.openMockModal();
		expect(promptMockSettingsSpy)
			.toHaveBeenCalled();
	});
});
