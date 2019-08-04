import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { SoftwareVersionsComponent } from './software-versions.component';
import { SoftwareVersionsModule } from './software-versions.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OSVService } from '@sdp-api';
import { of } from 'rxjs';

describe('SoftwareVersionsComponent', () => {
	let component: SoftwareVersionsComponent;
	let fixture: ComponentFixture<SoftwareVersionsComponent>;
	let osvService: OSVService;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				SoftwareVersionsModule,
				HttpClientTestingModule,
			],
		})
			.compileComponents();
		osvService = TestBed.get(OSVService);
	}));

	beforeEach(() => {
		spyOn(osvService, 'getSoftwareVersions')
			.and
			.returnValue(of());
		fixture = TestBed.createComponent(SoftwareVersionsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should call getVersions list on init', fakeAsync(() => {
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalled();
	}));

	it('should refresh on sort', () => {
		component.onTableSortingChanged({
			key: 'Key1',
			value: 'Value1',
		});
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalledTimes(2);
	});

	it('should refresh on page change', () => {
		component.onPageChanged({ page: 2 });
		expect(osvService.getSoftwareVersions)
			.toHaveBeenCalledTimes(2);
	});
});
