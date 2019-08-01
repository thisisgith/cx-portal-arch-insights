import {
	Component,
	Input,
	TemplateRef,
	ViewChild,
	OnChanges,
} from '@angular/core';

import { LogService } from '@cisco-ngx/cui-services';
import { CuiTableOptions } from '@cisco-ngx/cui-components';

/**
 * CBP TBD table Component
 */
@Component({
	selector: 'cbp-tbd',
	styleUrls: ['./cbp-tbd.component.scss'],
	templateUrl: './cbp-tbd.component.html',
})
export class CbpTbdComponent implements OnChanges {

	@Input('cbpDetails') public cbpDetails: any;
	@ViewChild('riskTmpl', { static: true }) public riskTemplate: TemplateRef<any>;
	public tableOptions: CuiTableOptions;
	public tableLimit = 5;
	public tableOffset = 0;
	public totalItems = 8;
	public tableData: any[] = [];
	public tempData: any[] = [
		{
			bpRuleId: '8331',
			customerId: '167866829',
			uuid: '64836746289847',
			bpSeverity: 'Medium',
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpSecondaryTechnology: 'null',
			bpRuleTitle: 'IGMP Snooping disabled',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches running IOS (Catalyst 6500, 4000/4500, 3750, 3550, etc.) and it is recommended to use it, unless it is disabled by customer to workaround bug or as the workaround for specific host/application behavior. Disabling IGMP snooping will cause flooding of IP multicast on the L2 on all interfaces or on specific interface depending if IGMP snoo...See description for more',
			exceptions: 'exception1; exception2; exception3',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally (or on the specific interface where it was disabled)',
			bpRecommendation: 'IOS switches should not be sending interface syslog for up/down events for end-user ports.  While the rule cannot tell which ports are end-user ports, it is recommended that at least one active (non-shutdown) interface on a switch should have the interface syslogs disabled.',
			deviceIdsWithExceptions: '23493611;23493621;23493609;23493613;23493620',
		},
		{
			bpRuleId: '8333',
			customerId: '167866829',
			uuid: '64836746289847',
			bpSeverity: 'Medium',
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpSecondaryTechnology: 'null',
			bpRuleTitle: 'IGMP Snooping disabled',
			bpRuleSummary: 'IGMP snooping is disabled by default on the Catalyst switches running IOS (Catalyst 6500, 4000/4500, 3750, 3550, etc.) and it is recommended to use it, unless it is disabled by customer to workaround bug or as the workaround for specific host/application behavior. Disabling IGMP snooping will cause flooding of IP multicast on the L2 on all interfaces or on specific interface depending if IGMP snoo...See description for more',
			exceptions: 'exception1; exception2; exception3',
			correctiveAction: 'interface <interface_name>\n no logging event link-status',
			bpRecommendation: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally (or on the specific interface where it was disabled). Find alternative workaround, if disabling IGMP snooping was used as the workaround.',
			deviceIdsWithExceptions: '23493622;23493608;23493623;23493613;23493624',
		},
		{
			bpRuleId: '8332',
			customerId: '167866829',
			uuid: '64836746289847',
			bpSeverity: 'High',
			bpPrimaryTechnologies: 'Network Management,Wireless',
			bpSecondaryTechnology: 'null',
			bpRuleTitle: 'IGMP Snooping disabled',
			bpRuleSummary: 'IOS Switches have syslog notifications enabled by default on all interfaces.  But for many switches used to connect end-user ports, these notifications are unnecessarily "noisy" to Network Management Systems when users shut down their computers each day.',
			exceptions: 'exception1; exception2; exception3',
			correctiveAction: 'Re-enable IGMP snooping by configuring "ip igmp snooping" globally (or on the specific interface where it was disabled)',
			bpRecommendation: 'IOS switches should not be sending interface syslog for up/down events for end-user ports.  While the rule cannot tell which ports are end-user ports, it is recommended that at least one active (non-shutdown) interface on a switch should have the interface syslogs disabled.',
			deviceIdsWithExceptions: '23493611',
		},
	];

	constructor (private logger: LogService) {
	}

	/**
	 * Used to detect the changes in input object and call the getdata function
	 */
	public ngOnChanges () {
		this.totalItems = this.tempData.length;
		this.getData();
	}
	/**
	 * Used for getting pageNumber Index and call the getdata function
	 * @param pageInfo the key to match to the filter
	 */
	public onPagerUpdated (pageInfo: any) {
		this.tableOffset = pageInfo.page;
		this.getData();
	}
	/**
	 * used for setting the data for table
	 */
	public getData () {
		const index = this.tableOffset * this.tableLimit;
		this.tableData = this.tempData.slice(index, index + this.tableLimit);
		this.tableData = this.tableData.map((val: any) => {
			val.selected = false;
			return val;
		});

	}
}
