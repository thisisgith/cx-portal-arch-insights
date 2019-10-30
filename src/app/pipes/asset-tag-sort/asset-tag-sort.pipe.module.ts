
import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tags } from '@sdp-api';
/**
 * to filter the tags based on the searchText
 */
@Pipe({
	name: 'sortTags',
})

export class AssetTagSortPipe implements PipeTransform {
	/**
	 * Sorts tags based on tagName
	 * @param tags Array of Tags
	 * @returns Sorted Tags
	 */
	public transform (tags: Tags[]) {
		if (!tags) {
			return tags;
		}

		return tags.sort((t1 , t2) => (t1.tagName > t2.tagName) ? 1 : -1);
	}
}

/**
 * Module for custom dateTime pipe
 */
@NgModule({
	declarations: [
		AssetTagSortPipe,
	],
	exports: [
		AssetTagSortPipe,
	],
	imports: [
		CommonModule,
	],
})
export class AssetTagSortPipeModule { }
