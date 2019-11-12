import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { AssetTaggingComponent } from './asset-tagging.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { environment } from '@environment';
import { ActivatedRoute } from '@angular/router';
import { user } from '@mock';
import { AssetTaggingService } from '@sdp-api';
import { AssetTaggingModule } from './asset-tagging.module';
import { of } from 'rxjs';

describe('AssetTaggingComponent', () => {
	let component: AssetTaggingComponent;
	let fixture: ComponentFixture<AssetTaggingComponent>;

	configureTestSuite(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetTaggingModule,
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
			declarations: [AssetTaggingComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetTaggingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});

	it(`should call handleLeftTagSelectionChanged and
		 handleLeftTagSelectionChanged methods`, () => {
		spyOn(component, 'handleLeftTagSelectionChanged');
		spyOn(component, 'handleRightTagSelectionChanged');
		component.ngOnChanges();
		expect(component.handleLeftTagSelectionChanged)
			.toHaveBeenCalled();
		expect(component.handleRightTagSelectionChanged)
			.toHaveBeenCalled();
	});

	it('should remove select attibute from tags', () => {
		component.tagListRight = [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}];

		const tags = component.getTagListNoSelect();

		expect(tags.selected)
		.toBeUndefined();

	});

	it('should set the postParams if the tags are available in tagListRight', () => {
		component.tagListRight = [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}];

		component.submit();

		expect(component.postParams.length)
		.toEqual(component.tagListRight.length);
	});

	it('should add tags to tagListRight if tag is selected and remove from tagListLeft', () => {
		component.tagListLeft = [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		},
		{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: false,
			tagName: 'T1',
			tagValue: 'TID1',
		}];
		component.tagListRight = [];

		component.add();

		expect(component.tagListLeft.length)
			.toBe(1);
		expect(component.tagListRight.length)
			.toBe(1);
	});

	it('should remove tags from tagListRight if tag is selected and add to tagListLeft', () => {
		component.tagListLeft = [];
		component.tagListRight = [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: false,
			tagName: 'T1',
			tagValue: 'TID1',
		}];

		component.remove();

		expect(component.tagListLeft.length)
			.toBe(1);
		expect(component.tagListRight.length)
			.toBe(1);
	});

	it('should handle tag selection method based on selectorName', () => {
		spyOn(component, 'handleLeftTagSelectionChanged');
		spyOn(component, 'handleRightTagSelectionChanged');

		component.handleTagSelectionChanged(component.leftTags);
		expect(component.handleLeftTagSelectionChanged)
			.toHaveBeenCalled();

		component.handleTagSelectionChanged(component.rightTags);
		expect(component.handleRightTagSelectionChanged)
			.toHaveBeenCalled();
	});

	it('should update selectedRowsLeftCount with selected tags in tagListLeft', () => {
		component.tagListLeft = [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}];
		component.selectedRowsLeftCount = 0;

		component.handleLeftTagSelectionChanged();

		expect(component.selectedRowsLeftCount)
			.toBe(1);
	});

	it('should update selectedRowsRightCount with selected tags in tagListRight', () => {
		component.tagListRight = [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}];
		component.selectedRowsRightCount = 0;

		component.handleRightTagSelectionChanged();

		expect(component.selectedRowsRightCount)
			.toBe(1);
	});

	it('should update searchText based on selectorName', () => {
		const searchText = 'search';
		component.onSearchQuery(searchText, component.leftTags);
		expect(component.leftSearchText.length)
		.toBeGreaterThan(0);
		component.onSearchQuery(searchText, component.rightTags);
		expect(component.rightSearchText.length)
		.toBeGreaterThan(0);
	});

	it('should not call handleTagSelectionChanged if not tags are present', () => {
		const tags =  [];
		spyOn(component, 'handleTagSelectionChanged');
		component.toggleAllTagsSelected(tags, component.leftTags);
		expect(component.handleTagSelectionChanged)
		.not
		.toHaveBeenCalled();
	});

	it('should call handleTagSelectionChanged if tags are present for left list', () => {
		const tags =  [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: false,
			tagName: 'T2',
			tagValue: 'TID2',
		}];
		component.leftSearchText = 'T1';

		spyOn(component, 'handleTagSelectionChanged');
		component.toggleAllTagsSelected(tags, component.leftTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();

		component.leftSearchText = '88';
		component.allTagsSelectedLeft  = false;
		component.toggleAllTagsSelected(tags, component.leftTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();
		expect(component.allTagsSelectedLeft)
			.toBeTruthy();

		component.leftSearchText = 'T1,T2';
		component.allTagsSelectedLeft  = false;
		component.toggleAllTagsSelected(tags, component.leftTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();
		expect(component.allTagsSelectedLeft)
			.toBeTruthy();

		component.leftSearchText = '';
		component.toggleAllTagsSelected(tags, component.leftTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();
	});

	it('should call handleTagSelectionChanged if tags are present for right list', () => {
		const tags =  [{
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: true,
			tagName: 'T1',
			tagValue: 'TID1',
		}, {
			deviceCount: '3',
			devices: ['D1', 'D2', 'D3'],
			selected: false,
			tagName: 'T1',
			tagValue: 'TID1',
		}];
		component.rightSearchText = 'T1';

		spyOn(component, 'handleTagSelectionChanged');
		component.toggleAllTagsSelected(tags, component.rightTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();

		component.rightSearchText = '88';
		component.allTagsSelectedRight  = false;
		component.toggleAllTagsSelected(tags, component.rightTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();
		expect(component.allTagsSelectedRight)
			.toBeTruthy();

		component.rightSearchText = 'T1,T2';
		component.allTagsSelectedRight  = false;
		component.toggleAllTagsSelected(tags, component.rightTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();
		expect(component.allTagsSelectedRight)
			.toBeTruthy();

		component.rightSearchText = '';
		component.toggleAllTagsSelected(tags, component.rightTags);
		expect(component.handleTagSelectionChanged)
		.toHaveBeenCalled();
	});

});
