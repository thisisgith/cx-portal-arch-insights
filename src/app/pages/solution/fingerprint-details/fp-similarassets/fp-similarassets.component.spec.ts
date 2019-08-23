import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FpSimilarAssetsComponent } from './fp-similarassets.component';
import { FpSimilarAssetsModule } from './fp-similarassets.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CuiTableModule, CuiPagerModule } from '@cisco-ngx/cui-components';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MicroMockModule } from '@cui-x-views/mock';

describe('FpSimilarassetsComponent', () => {
	let component: FpSimilarAssetsComponent;
	let fixture: ComponentFixture<FpSimilarAssetsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				FpSimilarAssetsModule,
				HttpClientTestingModule,
				CuiTableModule,
				CuiPagerModule,
				RouterTestingModule,
				MicroMockModule,
			],
			providers: [
				{ provide: 'ENVIRONMENT', useValue: environment },
				{
					provide: ActivatedRoute,
					useValue: {
						queryParams: of({ }),
						snapshot: {
							data: {
								user,
							},
						},
					},
				},
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FpSimilarAssetsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});
});
