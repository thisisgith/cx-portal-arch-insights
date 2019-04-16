import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GaugePanelComponent } from './gauge-panel.component';
import { GaugePanelModule } from './gauge-panel.module';

describe('GaugePanelComponent', () => {
	let component: GaugePanelComponent;
	let fixture: ComponentFixture<GaugePanelComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [GaugePanelModule],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GaugePanelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});
});
