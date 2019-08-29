import { Injectable } from "@angular/core";

import * as _ from 'lodash';

@Injectable({
	providedIn: "root"
})
class RccUtilService {
	constructor() {

	}

	/**
 * Gets row selected
 * @param obj object
 * @returns opens slider
 */
	public getSelectableData(obj: object) {
		const res = {};
		for (let item in obj) {
			let tempArr = [];
			for (let j = 0; j < obj[item].length; j++) {
				tempArr.push({
					name: _.toString(obj[item][j]),
					value: j
				})
			}
			res[item] = tempArr;
		}
		return res;
	}

}
export { RccUtilService };
