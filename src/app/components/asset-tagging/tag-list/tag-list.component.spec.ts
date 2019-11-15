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
		component.ngOnChanges();
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

	it('should return sorted tags', () => {

		const tags = [{
			tagName: 'T2',
			tagValue: 'TID1',
		}, {
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			tagName: 'T3',
			tagValue: 'TID1',
		}, {
			tagName: 'T4',
			tagValue: 'TID1',
		}] ;
		component.searchText = '';

		const sortedTags = component.sortAndFilterTags(tags);
		expect(sortedTags[0].tagName.toLowerCase())
		.toEqual('t1');

	});

	it('should return filtered tags', () => {

		let tags = [{
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			tagName: 'T2',
			tagValue: 'TID1',
		}, {
			tagName: 'T3',
			tagValue: 'TID1',
		}] ;
		component.searchText = '1';
		const filteredtags = component.filterTags(tags);
		expect(filteredtags.length)
		.toBe(1);

		tags = [{
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			tagName: 'T2',
			tagValue: 'TID1',
		}, {
			tagName: 'T3',
			tagValue: 'TID1',
		}] ;
		component.searchText = 'T1,T2';
		const advfilteredtags = component.filterTags(tags);
		expect(advfilteredtags.length)
		.toBe(2);

		tags = [{
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			tagName: 'T2',
			tagValue: 'TID1',
		}, {
			tagName: 'T3',
			tagValue: 'TID1',
		}] ;
		component.searchText = '';
		const alltags = component.filterTags(tags);
		expect(alltags.length)
		.toBe(3);
	});

});
