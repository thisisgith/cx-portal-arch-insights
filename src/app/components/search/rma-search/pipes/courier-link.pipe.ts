import { Pipe, PipeTransform } from '@angular/core';

/**
 * Mapping of courier names to URLs
 * {0} param corresponds to trackingNumber
 */
const courierMap = {
	BLUEDART: `
	<a data-auto-id="courierID" target="_blank"
		href="https://www.bluedart.com/">
		https://www.bluedart.com
	</a>
	`,
	CHOICE: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.Choicecourier.com">
		https://www.Choicecourier.com
	</a>
	`,
	DHL: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.dhl.com/cgi-bin/tracking.pl?AWB={0}">
		{0}
	</a>
	`,
	F1: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.fedex.com/Tracking?
		action=track&language=english&cntry_code=<C>&initial=x&mps=y&tracknumbers={0}">
		{0}
	</a>
	`,
	FEDEX: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.fedex.com/Tracking?action=track&language=english&
		cntry_code=<C>&initial=x&mps=y&tracknumbers={0}">
		{0}
	</a>
	`,
	GATI: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.gati.com/single_dkt_track.jsp?dktNo={0}">
		{0}
	</a>
	`,
	'KUEHNE NAG': `
	<a data-auto-id="courierID"
		target="_blank" href="https://knlogin.kuehne-nagel.com/lls/llsfls.do?
		event=show&subevent=search&transportOrderReference={0}">
		{0}
	</a>
	`,
	NNS: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.nns.com.cn/cisco_cn/cx/cx2013.aspx?pod={0}">
		{0}
	</a>
	`,
	TNT: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.tnt.com/webtracker/tracking.do?&searchType=CON&cons={0}">
		{0}
	</a>
	`,
	TNTAU: `
	<a data-auto-id="courierID"
		target="_blank" href="https://www.tntexpress.com.au/InterAction/ASPs/CnmHxAS.asp?{0}">
		{0}
	</a>
	`,
	UPS: `
	<a data-auto-id="courierID"
		target="_blank" href="https://wwwapps.ups.com/etracking/tracking.cgi?
	TypeOfInquiryNumber=T&InquiryNumber1={0}">
		{0}
	</a>
	`,
};

/**
 * Pipe for building a courier link from courier name and tracking number
 * returns correct HTML anchor tag pointed to provided tracking num (if provided)
 */
@Pipe({
	name: 'courierLink',
})
export class CourierLinkPipe implements PipeTransform {

	/**
	 * Perform string transformation
	 * @param courierName courier name
	 * @param args any additional params to fill in the link (templated like {0}, {1}, etc.)
	 * @returns tracking link
	 */
	public transform (courierName: string, ...args: string[]): string {
		let courierLink = courierMap[courierName];
		if (!courierLink) {
			return null;
		}

		args.forEach((s, idx) => {
			courierLink = courierLink.replace(new RegExp(`\\{${idx}\\}`, 'g'), s);
		});

		return courierLink;
	}

}
