import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TagListComponent } from './tag-list.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { AssetTaggingService } from '@sdp-api';
import { TagListModule } from './tag-list.module';
import { of } from 'rxjs';
import { configureTestSuite } from 'ng-bullet';

describe('TagListComponent', () => {
	let component: TagListComponent;
	let fixture: ComponentFixture<TagListComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				TagListModule,
				HttpClientTestingModule,
				RouterTestingModule,
			], providers: [
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
				}, AssetTaggingService,
			],
		});
	});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TagListComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TagListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it('should run refresh', () => {
		spyOn(component, 'refresh');
		component.ngAfterViewInit();
		expect(component.refresh)
		.toHaveBeenCalled();
	});

	it('should handle list with no items', () => {
		component.items = [];
		component.refresh();
		component.ngDoCheck();

		expect(component.itemsInView.length)
				.toBe(0);
	});

	it('should toggle selection for tag object', () => {
		const tag = {
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		};
		component.isDisabled = false;
		component.toggleTagSelected(tag);
		expect(tag.selected)
				.toBeFalsy();

		tag.selected = true;
		component.isDisabled = true;
		component.toggleTagSelected(tag);
		expect(tag.selected)
				.toBeTruthy();
	});

});
