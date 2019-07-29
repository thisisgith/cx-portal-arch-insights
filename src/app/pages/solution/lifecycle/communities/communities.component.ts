import {
	Component, OnDestroy,
} from '@angular/core';
import * as _ from 'lodash-es';

import { LogService } from '@cisco-ngx/cui-services';
import { RacetrackTechnology } from '@sdp-api';
import { Subject } from 'rxjs';
import { SolutionService } from '../../solution.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

/** Interface of each Community info */
interface CommunityDetail {
	usecase: string;
	url: string;
	description: string;
}

/** Set data for public Community Info */
const publicCommunities: CommunityDetail[] = [
	{
		description: 'Wireless & Mobility',
		url: ' https://community.cisco.com/t5/wireless-and-mobility' +
		'/bd-p/5956-discussions-getting-started-wireles',
		usecase: 'campus network assurance'	,
	},
	{
		description: 'Software-Defined Access (SD-Access)',
		url: 'https://community.cisco.com/t5/software-defined-access-sd/bd-p/discussions-sd-access',
		usecase: 'campus network segmentation',
	},
	{
		description: 'Software-Defined Access (SD-Access)',
		url: 'https://community.cisco.com/t5/software-defined-access-sd/bd-p/discussions-sd-access',
		usecase: 'scalable access policy',
	},
	{
		description: 'Cisco Digital Network Architecture (DNA)',
		url: 'https://community.cisco.com/t5/cisco-digital-network/bd-p/discussions-dna',
		usecase: 'network device onboarding',
	},
	{
		description: 'Cisco Digital Network Architecture (DNA)',
		url: 'https://community.cisco.com/t5/cisco-digital-network/bd-p/discussions-dna',
		usecase: 'campus software image management',
	},
];

/** Communities Component */
@Component({
	selector: 'app-communities',
	templateUrl: './communities.component.html',
})
export class CommunitiesComponent implements OnDestroy {
	private selectedTechnology: string;
	public publicCommunity: CommunityDetail;
	public privateCommunity: CommunityDetail;
	public publicCommunityUrl: SafeUrl;
	public privateCommunityUrl: SafeUrl;
	private destroy$ = new Subject();

	constructor (
		private logger: LogService,
		private solutionService: SolutionService,
		private sanitizer: DomSanitizer,
	) {
		this.logger.debug('CommunitiesComponent Created!');

		this.solutionService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnology = technology.name;
			this.getCommunities();
			this.publicCommunityUrl = sanitizer.bypassSecurityTrustUrl(this.publicCommunity.url);
			this.privateCommunityUrl = sanitizer.bypassSecurityTrustUrl(this.privateCommunity.url);
		});
	}

	/**
	 * Get the Communities
	 */
	private getCommunities () {
		this.getPublicCommunities();
		this.getPrivateCommunities();
	}

	/**
	 * Get the Public Communities
	 */
	private getPublicCommunities () {
		if (publicCommunities && this.selectedTechnology) {
			this.publicCommunity = _.find(publicCommunities,
				{ usecase: this.selectedTechnology.toLowerCase() });
		}
	}

	/**
	 * Get the Public Communities
	 */
	 private getPrivateCommunities () {
		// this is hardcoded for now, will change it later
		if (publicCommunities) {
			this.privateCommunity = _.find(publicCommunities,
				{ usecase: this.selectedTechnology.toLowerCase() });
		}
	}

	/**
	 * Handler for clean up on component destruction
	 */
	 public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
