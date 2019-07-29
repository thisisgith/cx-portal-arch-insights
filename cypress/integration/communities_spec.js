// import MockService from '../support/mockService';


// const commMock = new MockService('CommunitiesScenarios'); // for future changes
// environments/mock/communities.ts
// const commOnboardScenario = commMock.getScenario('GET', '(Communities) IBN-Assurance-Onboard');
// will give error if commItems is not used below
// const commItems = commOnboardScenario.response.body.items;

// Hard-coded URL and title mapping
const communitiesMapping = [
	{
		usecase: 'Campus Network Assurance',
		title: 'Wireless & Mobility',
		url: 'https://community.cisco.com/t5/wireless-and-mobility/bd-p/5956-discussions-getting-started-wireles',
	},
	{
		usecase: 'Campus Network Segmentation',
		title: 'Software-Defined Access (SD-Access)',
		url: 'https://community.cisco.com/t5/software-defined-access-sd/bd-p/discussions-sd-access',
	},
	{
		usecase: 'Scalable Access Policy',
		title: 'Software-Defined Access (SD-Access)',
		url: 'https://community.cisco.com/t5/software-defined-access-sd/bd-p/discussions-sd-access',
	},
	{
		usecase: 'Network Device Onboarding',
		title: 'Cisco Digital Network Architecture (DNA)',
		url: 'https://community.cisco.com/t5/cisco-digital-network/bd-p/discussions-dna',
	},
	{
		usecase: 'Campus Software Image Management',
		title: 'Cisco Digital Network Architecture (DNA)',
		url: 'https://community.cisco.com/t5/cisco-digital-network/bd-p/discussions-dna',
	},
];

describe('Communities Panel', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();
	});

	describe('PBC-358: (UI View) - Solution Racetrack - View Public Community Forum', () => {
		// PBC-358 Hard-codes the URL mappings for communities based on use case
		after(() => {
			// Make sure we're switched back to the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
		});

		communitiesMapping.forEach(mapping => {
			it(`Community Links for use case: ${mapping.usecase}`, () => {
				// Switch to use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId(`TechnologyDropdown-${mapping.usecase}`).click();

				// Verify the communities URL and tooltip
				cy.getByAutoId(`communitytitle-${mapping.title}-Lifecycle`)
					.should('exist')
					.should('have.attr', 'title', mapping.title)
					.should('have.attr', 'href', mapping.url)
					.should('have.attr', 'target', '_blank');	// target: _blank for cross-launch

				cy.getByAutoId(`communitytitle-${mapping.title}-Public`)
					.should('exist')
					.should('have.attr', 'title', mapping.title)
					.should('have.attr', 'href', mapping.url)
					.should('have.attr', 'target', '_blank');	// target: _blank for cross-launch
			});
		});
	});
});
