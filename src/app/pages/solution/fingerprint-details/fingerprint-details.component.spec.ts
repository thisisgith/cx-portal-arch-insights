import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FingerprintDetailsComponent } from './fingerprint-details.component';
import { FingerprintDetailsModule } from './fingerprint-details.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FingerprintDetailsComponent', () => {
	let component: FingerprintDetailsComponent;
	let fixture: ComponentFixture<FingerprintDetailsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [FingerprintDetailsModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FingerprintDetailsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});
	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

});
