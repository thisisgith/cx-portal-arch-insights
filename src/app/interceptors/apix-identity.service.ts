import { Injectable } from '@angular/core';
import * as _ from 'lodash-es';
import { OriginType } from '@constants';
import { environment } from '@environment';

@Injectable({
	providedIn: 'root',
})
export class ApixIdentityService {
	private originRegex: RegExp;
	private sdpRegex: RegExp;
	private rmaRegex: RegExp;

	constructor () {
		const sdpServiceOrigin = environment.sdpServiceOrigin &&
			_.get(
				environment.sdpServiceOrigin.match(/(https:\/\/.*?)\//),
				'[1]',
				_.get(environment.sdpServiceOrigin.match(/(https:\/\/.*?)$/), '[1]'),
			);
		const rmaServiceOrigin = environment.rmaServiceOrigin &&
			_.get(
				environment.rmaServiceOrigin.match(/(https:\/\/.*?)\//),
				'[1]',
				_.get(environment.rmaServiceOrigin.match(/(https:\/\/.*?)$/), '[1]'),
			);
		if (sdpServiceOrigin === rmaServiceOrigin) {
			this.originRegex = new RegExp(`^${sdpServiceOrigin}`);
		} else {
			this.originRegex =
				new RegExp(`^${sdpServiceOrigin}|^${rmaServiceOrigin}`);
		}

		this.sdpRegex = new RegExp(`^${
			_.values(environment.sdpServicePaths)
			.join('|^')
		}`);
		this.rmaRegex = new RegExp(`^${
			_.values(environment.rmaServicePaths)
			.join('|^')
		}`);
	}

	public testOrigin (url): OriginType {
		if (this.originRegex.test(url.origin)) {
			if (this.sdpRegex.test(url.pathname)) {
				return OriginType.SDP;
			}
			if (this.rmaRegex.test(url.pathname)) {
				return OriginType.RMA;
			}
		}

		return OriginType.NONE;
	}
}
