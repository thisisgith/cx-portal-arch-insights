// Hard-coded URL and title mapping
const communitiesMapping = [
	{
		usecase: 'Campus Network Assurance',
		title: 'Wireless & Mobility',
		url: 'https://community.cisco.com/t5/wireless-and-mobility/bd-p/5956-discussions-getting-started-wireles',
		pitstops: [
			{
				name: 'Onboard',
				curatedTooltip: 'Campus Network Assurance - Onboard',
				curatedURL: 'https://community.cisco.com/t5/campus-network-assurance/bd-p/ibn-assurance/customFilteredByMultiLabel?board=ibn-assurance&amp;labels=Onboard',
			},
			{
				name: 'Implement',
				curatedTooltip: 'Campus Network Assurance - Implement',
				curatedURL: 'https://community.cisco.com/t5/campus-network-assurance/bd-p/ibn-assurance/customFilteredByMultiLabel?board=ibn-assurance&amp;labels=Implement',
			},
			{
				name: 'Use',
				curatedTooltip: 'Campus Network Assurance - Use',
				curatedURL: 'https://community.cisco.com/t5/campus-network-assurance/bd-p/ibn-assurance/customFilteredByMultiLabel?board=ibn-assurance&amp;labels=Use',
			},
			{
				name: 'Engage',
				curatedTooltip: 'Campus Network Assurance - Engage',
				curatedURL: 'https://community.cisco.com/t5/campus-network-assurance/bd-p/ibn-assurance/customFilteredByMultiLabel?board=ibn-assurance&amp;labels=Engage',
			},
			{
				name: 'Adopt',
				curatedTooltip: 'Campus Network Assurance - Adopt',
				curatedURL: 'https://community.cisco.com/t5/campus-network-assurance/bd-p/ibn-assurance/customFilteredByMultiLabel?board=ibn-assurance&amp;labels=Adopt',
			},
			{
				name: 'Optimize',
				curatedTooltip: 'Campus Network Assurance - Optimize',
				curatedURL: 'https://community.cisco.com/t5/campus-network-assurance/bd-p/ibn-assurance/customFilteredByMultiLabel?board=ibn-assurance&amp;labels=Optimize',
			},
		],
	},
	{
		usecase: 'Campus Network Segmentation',
		title: 'Software-Defined Access (SD-Access)',
		url: 'https://community.cisco.com/t5/software-defined-access-sd/bd-p/discussions-sd-access',
		pitstops: [
			{
				name: 'Onboard',
				curatedTooltip: 'Campus Network Segmentation - Onboard',
				curatedURL: 'https://community.cisco.com/t5/campus-network-segmentation/bd-p/ibn-segmentation/customFilteredByMultiLabel?board=ibn-segmentation&amp;labels=Onboard',
			},
			{
				name: 'Implement',
				curatedTooltip: 'Campus Network Segmentation - Implement',
				curatedURL: 'https://community.cisco.com/t5/campus-network-segmentation/bd-p/ibn-segmentation/customFilteredByMultiLabel?board=ibn-segmentation&amp;labels=Implement',
			},
			{
				name: 'Use',
				curatedTooltip: 'Campus Network Segmentation - Use',
				curatedURL: 'https://community.cisco.com/t5/campus-network-segmentation/bd-p/ibn-segmentation/customFilteredByMultiLabel?board=ibn-segmentation&amp;labels=Use',
			},
			{
				name: 'Engage',
				curatedTooltip: 'Campus Network Segmentation - Engage',
				curatedURL: 'https://community.cisco.com/t5/campus-network-segmentation/bd-p/ibn-segmentation/customFilteredByMultiLabel?board=ibn-segmentation&amp;labels=Engage',
			},
			{
				name: 'Adopt',
				curatedTooltip: 'Campus Network Segmentation - Adopt',
				curatedURL: 'https://community.cisco.com/t5/campus-network-segmentation/bd-p/ibn-segmentation/customFilteredByMultiLabel?board=ibn-segmentation&amp;labels=Adopt',
			},
			{
				name: 'Optimize',
				curatedTooltip: 'Campus Network Segmentation - Optimize',
				curatedURL: 'https://community.cisco.com/t5/campus-network-segmentation/bd-p/ibn-segmentation/customFilteredByMultiLabel?board=ibn-segmentation&amp;labels=Optimize',
			},
		],
	},
	{
		usecase: 'Scalable Access Policy',
		title: 'Software-Defined Access (SD-Access)',
		url: 'https://community.cisco.com/t5/software-defined-access-sd/bd-p/discussions-sd-access',
		pitstops: [
			{
				name: 'Onboard',
				curatedTooltip: 'Scalable Access Policy - Onboard',
				curatedURL: 'https://community.cisco.com/t5/scalable-access-policy/bd-p/ibn-policy/customFilteredByMultiLabel?board=ibn-policy&amp;labels=Onboard',
			},
			{
				name: 'Implement',
				curatedTooltip: 'Scalable Access Policy - Implement',
				curatedURL: 'https://community.cisco.com/t5/scalable-access-policy/bd-p/ibn-policy/customFilteredByMultiLabel?board=ibn-policy&amp;labels=Implement',
			},
			{
				name: 'Use',
				curatedTooltip: 'Scalable Access Policy - Use',
				curatedURL: 'https://community.cisco.com/t5/scalable-access-policy/bd-p/ibn-policy/customFilteredByMultiLabel?board=ibn-policy&amp;labels=Use',
			},
			{
				name: 'Engage',
				curatedTooltip: 'Scalable Access Policy - Engage',
				curatedURL: 'https://community.cisco.com/t5/scalable-access-policy/bd-p/ibn-policy/customFilteredByMultiLabel?board=ibn-policy&amp;labels=Engage',
			},
			{
				name: 'Adopt',
				curatedTooltip: 'Scalable Access Policy - Adopt',
				curatedURL: 'https://community.cisco.com/t5/scalable-access-policy/bd-p/ibn-policy/customFilteredByMultiLabel?board=ibn-policy&amp;labels=Adopt',
			},
			{
				name: 'Optimize',
				curatedTooltip: 'Scalable Access Policy - Optimize',
				curatedURL: 'https://community.cisco.com/t5/scalable-access-policy/bd-p/ibn-policy/customFilteredByMultiLabel?board=ibn-policy&amp;labels=Optimize',
			},
		],
	},
	{
		usecase: 'Network Device Onboarding',
		title: 'Cisco Digital Network Architecture (DNA)',
		url: 'https://community.cisco.com/t5/cisco-digital-network/bd-p/discussions-dna',
		pitstops: [
			{
				name: 'Onboard',
				curatedTooltip: 'Network Device Onboarding - Onboard',
				curatedURL: 'https://community.cisco.com/t5/network-device-onboarding/bd-p/ibn-onboarding/customFilteredByMultiLabel?board=ibn-onboarding&amp;labels=Onboard',
			},
			{
				name: 'Implement',
				curatedTooltip: 'Network Device Onboarding - Implement',
				curatedURL: 'https://community.cisco.com/t5/network-device-onboarding/bd-p/ibn-onboarding/customFilteredByMultiLabel?board=ibn-onboarding&amp;labels=Implement',
			},
			{
				name: 'Use',
				curatedTooltip: 'Network Device Onboarding - Use',
				curatedURL: 'https://community.cisco.com/t5/network-device-onboarding/bd-p/ibn-onboarding/customFilteredByMultiLabel?board=ibn-onboarding&amp;labels=Use',
			},
			{
				name: 'Engage',
				curatedTooltip: 'Network Device Onboarding - Engage',
				curatedURL: 'https://community.cisco.com/t5/network-device-onboarding/bd-p/ibn-onboarding/customFilteredByMultiLabel?board=ibn-onboarding&amp;labels=Engage',
			},
			{
				name: 'Adopt',
				curatedTooltip: 'Network Device Onboarding - Adopt',
				curatedURL: 'https://community.cisco.com/t5/network-device-onboarding/bd-p/ibn-onboarding/customFilteredByMultiLabel?board=ibn-onboarding&amp;labels=Adopt',
			},
			{
				name: 'Optimize',
				curatedTooltip: 'Network Device Onboarding - Optimize',
				curatedURL: 'https://community.cisco.com/t5/network-device-onboarding/bd-p/ibn-onboarding/customFilteredByMultiLabel?board=ibn-onboarding&amp;labels=Optimize',
			},
		],
	},
	{
		usecase: 'Campus Software Image Management',
		title: 'Cisco Digital Network Architecture (DNA)',
		url: 'https://community.cisco.com/t5/cisco-digital-network/bd-p/discussions-dna',
		pitstops: [
			{
				name: 'Onboard',
				curatedTooltip: 'Campus Software Image Management - Onboard',
				curatedURL: 'https://community.cisco.com/t5/campus-software-image-management/bd-p/ibn-swim/customFilteredByMultiLabel?board=ibn-swim&amp;labels=Onboard',
			},
			{
				name: 'Implement',
				curatedTooltip: 'Campus Software Image Management - Implement',
				curatedURL: 'https://community.cisco.com/t5/campus-software-image-management/bd-p/ibn-swim/customFilteredByMultiLabel?board=ibn-swim&amp;labels=Implement',
			},
			{
				name: 'Use',
				curatedTooltip: 'Campus Software Image Management - Use',
				curatedURL: 'https://community.cisco.com/t5/campus-software-image-management/bd-p/ibn-swim/customFilteredByMultiLabel?board=ibn-swim&amp;labels=Use',
			},
			{
				name: 'Engage',
				curatedTooltip: 'Campus Software Image Management - Engage',
				curatedURL: 'https://community.cisco.com/t5/campus-software-image-management/bd-p/ibn-swim/customFilteredByMultiLabel?board=ibn-swim&amp;labels=Engage',
			},
			{
				name: 'Adopt',
				curatedTooltip: 'Campus Software Image Management - Adopt',
				curatedURL: 'https://community.cisco.com/t5/campus-software-image-management/bd-p/ibn-swim/customFilteredByMultiLabel?board=ibn-swim&amp;labels=Adopt',
			},
			{
				name: 'Optimize',
				curatedTooltip: 'Campus Software Image Management - Optimize',
				curatedURL: 'https://community.cisco.com/t5/campus-software-image-management/bd-p/ibn-swim/customFilteredByMultiLabel?board=ibn-swim&amp;labels=Optimize',
			},
		],
	},
];

describe('Communities Panel', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.window().then(win => { // Must be done after app loads
			win.Cypress.hideDNACHeader = true;
		});
		cy.waitForAppLoading();
	});

	context('PBC-358: (UI View) - Solution Racetrack - View Public Community Forum', () => {
		// PBC-358 Hard-codes the URL mappings for communities based on use case
		after(() => {
			// Make sure we're switched back to the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
		});

		it('Correctly formats the communities tile', () => { // PBC-126, PBC-585
			cy.getByAutoId('PanelTitle-Communities')
				.should('have.text', 'Cisco Community')
				.and('have.class', 'text-uppercase');
			cy.getByAutoId('CuratedCommunityLink').within(() => {
				cy.get('.icon-communities').should('be.visible');
				cy.get('#curatedcommunitytitle').should('have.text', 'Success Track');
			});
			cy.getByAutoId('PublicCommunityLink').within(() => {
				cy.get('.icon-communities').should('be.visible');
				cy.get('#publiccommunitytitle').should('have.text', 'Public');
			});
		});

		communitiesMapping.forEach(mapping => {
			it(`Public Community Links for use case: ${mapping.usecase}`, () => {
				// Switch to use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId(`TechnologyDropdown-${mapping.usecase}`).click();

				// Verify the communities public URL and tooltip
				cy.getByAutoId(`communitytitle-${mapping.title}-Public`)
					.should('exist')
					.and('have.attr', 'title', mapping.title)
					.and('have.attr', 'href', mapping.url)
					.and('have.attr', 'target', '_blank')	// target: _blank for cross-launch
					.and('have.attr', 'data-toggle', 'tooltip');	// tooltip
			});

			// PBC-97, PBC-451, PBC-585
			context(`PBC-97: Success Track Communities Link for ${mapping.usecase}`, () => {
				beforeEach(() => {
					// Switch to use case
					cy.getByAutoId('UseCaseDropdown').click();
					cy.getByAutoId(`TechnologyDropdown-${mapping.usecase}`).click();
				});

				mapping.pitstops.forEach(pitstop => {
					it(`Success Track Community Links for pitstop: ${pitstop.name}`, () => {
						cy.getByAutoId(`Racetrack-Point-${pitstop.name.toLowerCase()}`)
							.click({ force: true });
						cy.getByAutoId(`communitytitle-${pitstop.curatedTooltip}-Lifecycle`)
							.should('have.text', 'Success Track')
							.and('have.attr', 'title', pitstop.curatedTooltip)
							.and('have.attr', 'target', '_blank')
							.and('have.attr', 'href', pitstop.curatedURL);
					});
				});
			});
		});
	});
});
