import { configureTestSuite } from 'ng-bullet';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyslogsComponent } from './syslogs.component';
import { SyslogsModule } from './syslogs.module';
import { SyslogsService } from '@sdp-api';
import { throwError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SyslogScenarios } from 'src/environments/mock/syslogs/syslogs';
import { RacetrackInfoService } from '@services';
describe('SyslogsComponent', () => {
	let component: SyslogsComponent;
	let fixture: ComponentFixture<SyslogsComponent>;
	let syslogsService: SyslogsService;
	let racetrackInfoService: RacetrackInfoService;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				SyslogsModule,
				HttpClientTestingModule,
				RouterTestingModule,
			],
			providers: [SyslogsService, RacetrackInfoService],
		});
	});

	beforeEach(() => {
		window.localStorage.clear();
		syslogsService = TestBed.get(SyslogsService);
		racetrackInfoService = TestBed.get(RacetrackInfoService);
		fixture = TestBed.createComponent(SyslogsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should set count values on request success', () => {
		spyOn(syslogsService, 'getSyslogsCount')
			.and
			.returnValue(of(SyslogScenarios[0].scenarios.POST[0].response.body));
		component.fetchSyslogsCount();

		expect(syslogsService.getSyslogsCount)
			.toHaveBeenCalled();
	});

	it('should set null values on request errors', () => {
		const error = {
			status: 404,
			statusText: 'Resource not found',
		};
		spyOn(syslogsService, 'getSyslogsCount')
			.and
			.returnValue(throwError(new HttpErrorResponse(error)));
		component.fetchSyslogsCount();

		expect(syslogsService.getSyslogsCount)
			.toHaveBeenCalled();
	});

	it('Should get the syslog message count data', () => {
		spyOn(racetrackInfoService, 'getCurrentTechnology')
		.and
		.callThrough();
		component.ngOnInit();
		expect(racetrackInfoService.getCurrentTechnology)
			.toHaveBeenCalled();
	});

	it('should SyslogMessage tab active', () => {
		fixture.detectChanges();
		const index = 0;
		component.selectVisualLabel(index);
		expect(component.visualLabels[0].active)
					.toBeTruthy();
	});

	it('should AssetTab tab active', () => {
		fixture.detectChanges();
		const index = 1;
		component.selectVisualLabel(index);
		expect(component.visualLabels[1].active)
					.toBeTruthy();
	});
});
