import {
	Component,
	ViewChildren,
	ViewChild,
	QueryList,
	AfterViewChecked,
	HostListener,
	OnInit,
	OnDestroy,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MicroMockService } from '@cui-x-views/mock';
import { HeaderDropdownComponent } from './header-dropdown/header-dropdown.component';
import { SearchComponent } from '../search/search.component';
import { environment } from '@environment';
import { Subject } from 'rxjs';
import { User } from '@interfaces';
import { UserResolve } from '@utilities';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash-es';
import { CuiModalService } from '@cisco-ngx/cui-components';
import { ContactSupportComponent } from '../contact-support/contact-support.component';
import { I18n } from '@cisco-ngx/cui-utils';

/**
 * Main Header Component
 */
@Component({
	selector: 'app-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html',
})
export class HeaderComponent implements AfterViewChecked, OnInit, OnDestroy {
	@ViewChild(SearchComponent, { static: false }) public searchComponent: SearchComponent;
	@ViewChildren(HeaderDropdownComponent)
	public dropdownComponents: QueryList<HeaderDropdownComponent>;
	public cxLevel: number;
	public name: string;
	public fullName: string;
	public initials = '??';
	public email: string;
	public userImage: string;
	public innerWidth: number;
	public team: any[];
	public webexUrl = environment.webexUrl;
	public webexTeamsUrl = environment.webexTeamsUrl;
	// TODO: Quick Help is not in the August release
	// public quickHelpLinks = [{
	// 	name: 'Open a Support Case',
	// 	routerLink: '/cases',
	// }];
	// TODO: Portal Support is feedback
	public portalHelpLinks = [{
		name: I18n.get('_GettingStarted_'),
		url: 'https://www.cisco.com/c/dam/en/us/support/docs/cloud-systems-management/Cisco-CX-Collector/Collector_Overview.pdf',
	}];
	public vendorLinks = [{
		name: I18n.get('_TermsConditions_'),
		url: 'https://www.cisco.com/c/en/us/about/legal/cloud-and-software/cloud-terms.html',
	},
	{
		name: I18n.get('_PrivateStmt_'),
		url: 'https://www.cisco.com/c/en/us/about/legal/privacy-full.html',
	},
	{
		name: I18n.get('_cookies_'),
		url: 'https://www.cisco.com/c/en/us/about/legal/privacy-full.html#cookies',
	},
	{
		name: I18n.get('_Trademarks_'),
		url: 'https://www.cisco.com/c/en/us/about/legal/trademarks.html',
	}];
	public profileLinks = [{
		href: environment.manageProfileUrl,
		name: 'Manage Profile',
	}, {
		href: environment.logoutUrl,
		name: 'Log Out',
	}];
	public communityLink = environment.communityLink;
	public learningLink = environment.learningLink;
	public searchExpanded: boolean;

	private focusSearch: boolean;
	private destroyed$: Subject<void> = new Subject<void>();

	constructor (
		private mockService: MicroMockService,
		private userResolve: UserResolve,
		private sanitizer: DomSanitizer,
		private cuiModalService: CuiModalService,
	) {
		this.updateProfileImage();
		this.userResolve.getUser()
		.pipe(
			takeUntil(this.destroyed$),
		)
		.subscribe((user: User) => {
			this.name = _.get(user, ['info', 'individual', 'name'], '');
			const lastName = _.get(user, ['info', 'individual', 'familyName'], '');
			this.fullName = `${this.name} ${lastName}`;
			this.email = _.get(user, ['info', 'individual', 'emailAddress'], '');
			this.cxLevel = _.get(user, ['service', 'cxLevel'], 0);
			this.team = _.cloneDeep(_.get(user, ['info', 'account', 'team'], []));
			this.team.forEach(member => {
				_.set(
					member,
					'image',
					this.generateAvatar(`${_.head(member.name)}${_.head(member.familyName)}`),
				);
			});
			if (!this.userImage || this.initials === '??') {
				this.initials = `${_.head(this.name)}${_.head(lastName)}`;
				this.updateProfileImage();
			}
		});
	}

	/**
	 * Sets the private innerWidth variable to the window's innerWidth
	 * @param event Window resize event
	 */
	@HostListener('window:resize', ['$event'])
	public onResize () {
		this.innerWidth = window.innerWidth;
	}

	/**
	 * Initialize the private innerWidth variable
	 */
	public ngOnInit () {
		this.innerWidth = window.innerWidth;
	}

	/**
	 * Autofocus on the search bar if it's just been expanded
	 */
	public ngAfterViewChecked () {
		if (this.focusSearch) {
			this.searchComponent.searchBarComponent.searchInput.nativeElement.focus();
			this.focusSearch = false;
		}
	}

	/**
	 * Handler for destroying the component
	 */
	public ngOnDestroy () {
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	/**
	 * open support modal.
	 */
	public openPortalSupport () {
		this.cuiModalService.showComponent(ContactSupportComponent, { });
	}

	/**
	 * Open the settings for the mock component
	 */
	public openMockModal () {
		this.mockService.promptMockSettings();
	}

	/**
	 * Open or close header dropdowns
	 * @param dropdown The specific dropdown clicked
	 * @param parent The parent element of the dropdown
	 */
	public toggleDropdown (
		dropdown: HeaderDropdownComponent,
		parent: any,
	) {
		if (!dropdown.open) {
			dropdown.openDropdown();
			parent.active = !parent.active;
			this.dropdownComponents.forEach(component => {
				if (component !== dropdown) {
					component.closeDropdown();
				}
			});
		}
	}

	/**
	 * Expand or collapse search based on focus events
	 * @param focused True if focus, false if blur
	 */
	public onSearchFocus (focused: boolean) {
		this.searchExpanded = focused;
	}

	/**
	 * Manually force search expansion and focus
	 */
	public expandSearch () {
		this.searchExpanded = true;
		this.focusSearch = true;
	}

	/**
	 * Tells whether to show or hide something based on the screen size
	 * @param breakpoint What screen width to test against
	 * @param [searchExpanded] Whether or not the search bar is expanded
	 * @returns boolean
	 */
	public searchBreakpointShow (
		breakpoint: number,
		searchExpanded: boolean = this.searchExpanded,
	) {
		if (this.innerWidth < breakpoint && searchExpanded) {
			return false;
		}

		return true;
	}

	/**
	 * Generates a png image canvas from the user's initials
	 * @param initials First and last name inititials
	 * @returns Data url of generated image for use in img tags
	 */
	public generateAvatar (initials: string) {
		const canvas = document.createElement('canvas');
		let context: any;
		let centerX: number;
		let centerY: number;
		let radius: number;
		let fontSize: number;

		canvas.width = 50;
		canvas.height = 50;
		context = canvas.getContext('2d');
		centerX = canvas.width / 2;
		centerY = canvas.height / 2;
		radius = canvas.width / 2;

		context.beginPath();
		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		context.fillStyle = '#ffffff';
		context.fill();

		fontSize = canvas.height / 2.5;
		context.font = `${fontSize}px CiscoSans, Arial, sans-serif`;
		context.textAlign = 'center';
		context.fillStyle = environment.cuiColors.vibrantBlue;
		context.fillText(initials.toUpperCase(),
			canvas.width / 2, canvas.height - (canvas.height / 2.8));

		return canvas.toDataURL('image/png');
	}

	/**
	 * Updates the userImage
	 */
	public updateProfileImage () {
		this.userImage = this.generateAvatar(this.initials);
	}

	/**
	 * Sanitizes URL strings to bypass angular's
	 * protocol whitelist and allow webexteams:// protocol
	 * @param url an unsanitized url
	 * @returns a sanitized url
	 */
	public sanitize (url: string) {
		return this.sanitizer.bypassSecurityTrustUrl(url);
	}
}
