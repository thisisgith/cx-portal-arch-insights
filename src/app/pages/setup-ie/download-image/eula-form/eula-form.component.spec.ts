import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EULAFormComponent } from './eula-form.component';
import { EULAFormModule } from './eula-form.module';

describe('EULAFormComponent', () => {
	let component: EULAFormComponent;
	let fixture: ComponentFixture<EULAFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				EULAFormModule,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EULAFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should emit download event', async(() => {
		const sub = component.onDownload.subscribe(() => {
			expect()
				.nothing();
			sub.unsubscribe();
		});
		component.onDownloadImage();
	}));
});
