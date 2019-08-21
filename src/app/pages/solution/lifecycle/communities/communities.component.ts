import {
	Component, OnDestroy,
} from '@angular/core';
import * as _ from 'lodash-es';
import { RacetrackTechnology } from '@sdp-api';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';
import { LifecycleComponent } from '../lifecycle.component';
import { RacetrackInfoService } from '@services';

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
		url: 'https://community.cisco.com/t5/wireless-and-mobility' +
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

/** Base of URL for Community */
const api = 'https://community.cisco.com/t5/custom/page/page-id/customFilteredByMultiLabel';

/** Communities Component */
@Component({
	selector: 'app-communities',
	styleUrls: ['./communities.component.scss'],
	templateUrl: './communities.component.html',
})
export class CommunitiesComponent implements OnDestroy {
	private selectedTechnology: string;
	private currentPitstop: string;
	public publicCommunity: CommunityDetail;
	public curatedCommunity: CommunityDetail;
	public publicCommunityUrl: SafeUrl;
	public curatedCommunityUrl: SafeUrl;
	private destroy$ = new Subject();

	constructor (
		private racetrackInfoService: RacetrackInfoService,
		private lifecycle: LifecycleComponent,
		private sanitizer: DomSanitizer,
	) {
		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnology = technology.name;
			this.currentPitstop = technology.currentPitstop;
			this.getCommunities();
			this.publicCommunityUrl = sanitizer.bypassSecurityTrustUrl(this.publicCommunity.url);
			this.curatedCommunityUrl = sanitizer.bypassSecurityTrustUrl(this.curatedCommunity.url);
		});
		this.lifecycle.getCurrentPitstop()
		.subscribe((pitstop: string) => {
			this.currentPitstop = pitstop;
			this.getCuratedCommunities();
			this.curatedCommunityUrl = sanitizer.bypassSecurityTrustUrl(this.curatedCommunity.url);
		});
	}

	/**
	 * Get the Communities
	 */
	private getCommunities () {
		this.getPublicCommunities();
		this.getCuratedCommunities();
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
	 private getCuratedCommunities () {
		let board = '';

		switch (this.selectedTechnology) {
			case 'Campus Network Assurance': {
				board = 'lifecycle-wireless-assurance';
				break;
			}
			case 'Campus Network Segmentation': {
				board = 'lifecycle-network-segmentation';
				break;
			}
			case 'Scalable Access Policy': {
				board = 'lifecycle-converged-mgmt';
				break;
			}
			case 'Network Device Onboarding': {
				board = 'lifecycle-onboard';
				break;
			}
			case 'Campus Software Image Management': {
				board = 'lifecycle-swim';
				break;
			}
			default: {
				break;
			}
		}

		this.curatedCommunity = {
			description: `${this.selectedTechnology} - ${this.currentPitstop}`,
			url: `${api}?board=${board}&amp;labels=${this.currentPitstop}`,
			usecase: this.selectedTechnology,
		};
	}

	/**
	 * Handler for clean up on component destruction
	 */
	 public ngOnDestroy () {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
