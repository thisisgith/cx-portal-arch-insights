import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagListComponent } from './tag-list.component';

describe('TagListComponent', () => {
	let component: TagListComponent;
	let fixture: ComponentFixture<TagListComponent>;

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
		expect(component.refresh)
		.toHaveBeenCalled();
	});

	it('should handle list with no items', () => {
		component.items = [];
		component.refresh();
		component.doCheck();

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
	});

});
