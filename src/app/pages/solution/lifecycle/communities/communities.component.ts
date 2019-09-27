import {
	Component, OnDestroy,
} from '@angular/core';
import * as _ from 'lodash-es';
import { RacetrackTechnology } from '@sdp-api';
import { environment } from '@environment';
import { Subject } from 'rxjs';
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
		url: `${environment.publicCommunityUrl}/wireless-and-mobility` +
			'/bd-p/5956-discussions-getting-started-wireles',
		usecase: 'campus network assurance'	,
	},
	{
		description: 'Software-Defined Access (SD-Access)',
		url: `${environment.publicCommunityUrl}/${environment.sdAccessCommunitiesPath}` +
			'/bd-p/discussions-sd-access',
		usecase: 'campus network segmentation',
	},
	{
		description: 'Software-Defined Access (SD-Access)',
		url: `${environment.publicCommunityUrl}/${environment.sdAccessCommunitiesPath}` +
			'/bd-p/discussions-sd-access',
		usecase: 'scalable access policy',
	},
	{
		description: 'Cisco Digital Network Architecture (DNA)',
		url: `${environment.publicCommunityUrl}/${environment.DNACommunititesPath}` +
			'/bd-p/discussions-dna',
		usecase: 'network device onboarding',
	},
	{
		description: 'Cisco Digital Network Architecture (DNA)',
		url: `${environment.publicCommunityUrl}/${environment.DNACommunititesPath}` +
			'/bd-p/discussions-dna',
		usecase: 'campus software image management',
	},
];

/** Communities Component */
@Component({
	selector: 'app-communities',
	styleUrls: ['./communities.component.scss'],
	templateUrl: './communities.component.html',
})
export class CommunitiesComponent implements OnDestroy {
	private selectedTechnology: string;
	public publicCommunity: CommunityDetail;
	public curatedCommunity: CommunityDetail;
	public publicCommunityUrl: string;
	public curatedCommunityUrl: string;
	private destroy$ = new Subject();

	constructor (
		private racetrackInfoService: RacetrackInfoService,
		private lifecycle: LifecycleComponent,
	) {
		this.racetrackInfoService.getCurrentTechnology()
		.pipe(
			takeUntil(this.destroy$),
		)
		.subscribe((technology: RacetrackTechnology) => {
			this.selectedTechnology = technology.name;
			this.getCommunities();
			this.publicCommunityUrl = this.publicCommunity.url;
			this.curatedCommunityUrl = this.curatedCommunity.url;
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
		let usecase = '';

		switch (this.selectedTechnology) {
			case 'Campus Network Assurance': {
				board = 'ibn-assurance';
				usecase = 'campus-network-assurance';
				break;
			}
			case 'Campus Network Segmentation': {
				board = 'ibn-segmentation';
				usecase = 'campus-network-segmentation';
				break;
			}
			case 'Scalable Access Policy': {
				board = 'ibn-policy';
				usecase = 'scalable-access-policy';
				break;
			}
			case 'Network Device Onboarding': {
				board = 'ibn-onboarding';
				usecase = 'network-device-onboarding';
				break;
			}
			case 'Campus Software Image Management': {
				board = 'ibn-swim';
				usecase = 'campus-software-image-management';
				break;
			}
			default: {
				break;
			}
		}

		this.curatedCommunity = {
			description: `${this.selectedTechnology}`,
			url: `${environment.curatedCommunityUrl}/${usecase}/bd-p/${board}`,
			usecase: this.selectedTechnology,
		};
	}

	/**
	 * Opens the given URL in a new tab
	 * @param crossLaunchUrl string
	 */
	 public crossLaunch (crossLaunchUrl: string) {
		if (crossLaunchUrl) {
			this.lifecycle.crossLaunch(crossLaunchUrl);
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
