import * as _ from 'lodash-es';

/** Reusable class for Serial No of Table */

export class MarshalTableData {

/***
	 * To push the new serialNumber property
	 * @param innerData comtains the table data
	 * @returns marshalled table data
	 */
	 public static marshalTableDataForInerGrid (innerData): any {
		_.each(innerData, messageObject => {
			_.each(messageObject.MessageDescObject, (i, index) => {
				if (i) {
					i.serialNumber = parseInt(index, 10) + 1;
				}
			});
		});

		return innerData;

	}
}
