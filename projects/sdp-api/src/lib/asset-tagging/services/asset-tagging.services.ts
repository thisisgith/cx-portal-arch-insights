/* tslint:disable */
import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { BaseService as __BaseService } from '../../core/base-service';
import { AssetTaggingConfiguration as __Configuration } from '../asset-tagging-configuration';
import { StrictHttpResponse as __StrictHttpResponse } from '../../core/strict-http-response';
import { Observable as __Observable } from 'rxjs';
import { map as __map, filter as __filter } from 'rxjs/operators';

import { DeviceDetails } from '../models/device-detail';
import { PolicyGroupDetails } from '../models/policy-group-details';
import { PolicyGroupList } from '../models/policy-group-list';
import { PolicyGroups } from '../models/policy-groups';
import { PolicyMapping } from '../models/policy-mapping';
import { Tags } from '../models/tags';

@Injectable({
	providedIn: 'root',
})

class AssetTaggingService extends __BaseService {

	constructor (
		config: __Configuration,
		http: HttpClient
	) {
		super(config, http);
	}
}



export { AssetTaggingService }
