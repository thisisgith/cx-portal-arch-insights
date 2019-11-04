import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Tags } from '@sdp-api';
import * as _ from 'lodash-es';

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

		if (searchText.indexOf(',') !== -1) {
			const searchTags = _.split(searchText, ',');

			return _.filter(tags, tag => searchTags.some(searchTag =>
				tag.tagName.toLowerCase() === searchTag.toLowerCase()));
		}

		return _.filter(tags, tag =>
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
