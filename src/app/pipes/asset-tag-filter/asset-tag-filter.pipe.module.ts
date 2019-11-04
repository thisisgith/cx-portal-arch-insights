import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tags } from '@sdp-api';
/**
 * to filter the tags based on the searchText
 */
@Pipe({
	name: 'filterTags',
})

export class AssetTagFilterPipe implements PipeTransform {
	/**
	 * Filtering tags based on search Text
	 * @param tags Array of Tags
	 * @param searchText Text based on which tags are filtered
	 * @returns Filtered Tags
	 */
	public transform (tags: Tags[], searchText: string) {
		if (!tags || !searchText) {
			return tags;
		}

		return tags.filter(tag =>
			tag.tagName.toLowerCase()
				.indexOf(searchText.toLowerCase()) !== -1);
	}
}

/**
 * Module for custom dateTime pipe
 */
@NgModule({
	declarations: [
		AssetTagFilterPipe,
	],
	exports: [
		AssetTagFilterPipe,
	],
	imports: [
		CommonModule,
	],
})
export class AssetTagFilterPipeModule { }
