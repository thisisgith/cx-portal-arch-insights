import MockService from '../support/mockService';

const elearningMock = new MockService('ELearningScenarios');
const elearningOnboardScenario = elearningMock.getScenario('GET', '(E-Learning) IBN-Campus Network Assurance-Onboard');
const elearningItems = elearningOnboardScenario.response.body.items;

const successPathMock = new MockService('SuccessPathScenarios');
const successPathOnboardScenario = successPathMock.getScenario('GET', '(SP) IBN-Campus Network Assurance-Onboard');
const successPathItems = successPathOnboardScenario.response.body.items;

const allProductGuidesScenario = successPathMock.getScenario('GET', 'Product Documenation & Videos response for all');
const allProductGuidesItems = allProductGuidesScenario.response.body.items;

// Strip out all possible archetypes
const successPathArchetypes = Cypress._.chain(successPathItems)
	.map('archetype')
	.uniq()
	.value();

const allProductGuidesArchetypes = Cypress._.chain(allProductGuidesItems)
	.map('archetype')
	.uniq()
	.value();

// Split up the eLearning response by type
const allELearningItems = [];
const allCertificationsItems = [];
elearningItems.forEach(scenario => {
	switch (scenario.type) {
		case 'E-Learning':
			allELearningItems.push(scenario);
			break;
		case 'Certification':
		case 'Videos':
			allCertificationsItems.push(scenario);
			break;
		case 'training':
			// Remote learning labs has been removed, so any 'training' will be ignored
			break;
		default:
			Cypress.log({
				name: 'LOG',
				message: `UNRECOGNIZED LEARNING SCENARIO TYPE: ${scenario.type}`,
			});
	}
});

// Split the arrays as we will only ever display the first 3 elements
const visibleELearningItems = allELearningItems.slice(0, 3);
const invisibleELearningItems = allELearningItems.slice(3);
const visibleCertificationsItems = allCertificationsItems.slice(0, 3);
const invisibleCertificationsItems = allCertificationsItems.slice(3);
const visibleSuccessPathItems = successPathItems.slice(0, 3);
const invisibleSuccessPathItems = successPathItems.slice(3);

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Learn Panel', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for both E-Learning and Success Paths to finish loading
		cy.waitForAppLoading('elearningLoading', 15000);
		cy.waitForAppLoading('successPathsLoading', 15000);

		// Close the setup wizard so it doesn't block other elements
		cy.getByAutoId('setup-wizard-header-close-btn').click();
	});

	describe('PBC-125 Learning Content', () => {
		it('Learning panel should be displayed', () => {
			cy.getByAutoId('Learn Panel').should('contain', 'Learn');
		});

		it('Learning card sections only show when there is data in them', () => {
			let elearningFound = false;
			let certificationsFound = false;
			elearningItems.forEach(scenario => {
				switch (scenario.type) {
					case 'E-Learning':
						elearningFound = true;
						break;
					case 'Certification':
					case 'Videos':
						certificationsFound = true;
						break;
					case 'training':
						// Remote learning labs has been removed, so any 'training' will be ignored
						break;
					default:
						Cypress.log({
							name: 'LOG',
							message: `UNRECOGNIZED LEARNING SCENARIO TYPE: ${scenario.type}`,
						});
				}
			});
			if (elearningFound) {
				cy.getByAutoId('LearnPanel-ELearningBlock').should('exist');
			} else {
				cy.getByAutoId('LearnPanel-ELearningBlock').should('not.exist');
			}
			if (certificationsFound) {
				cy.getByAutoId('LearnPanel-CertificationsBlock').should('exist');
			} else {
				cy.getByAutoId('LearnPanel-CertificationsBlock').should('not.exist');
			}

			if (successPathItems.length > 0) {
				cy.getByAutoId('Success Bytes Panel').should('exist')
					.and('contain', 'Success Bytes')
					.and('contain', 'Resources to fine-tune your tech');
			} else {
				cy.getByAutoId('Success Bytes Panel').should('not.exist');
			}
		});

		it('Should display up to 3 API results for each learning section', () => {
			// Verify only up to the first three are shown in each section
			visibleELearningItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-ELearningBlock')
					.should('contain', scenario.title);
			});
			invisibleELearningItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-ELearningBlock')
					.should('not.contain', scenario.title);
			});
			visibleCertificationsItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-CertificationsBlock')
					.should('contain', scenario.title);
			});
			invisibleCertificationsItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-CertificationsBlock')
					.should('not.contain', scenario.title);
			});
			visibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('Success Bytes Panel')
					.should('contain', scenario.title);
			});
			invisibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('Success Bytes Panel')
					.should('not.contain', scenario.title);
			});
		});
	});

	describe('PBC-15: (UI) View - Lifecycle - Success Bytes - View All Card View', () => {
		beforeEach(() => {
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		afterEach(() => {
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('PBC-142/PBC-143: View All Success Bytes link should open modal with all results', () => {
			cy.getByAutoId('ViewAllModal').should('exist')
				.and('contain', 'Success Bytes')
				.and('contain', 'Resources to fine-tune your tech')
				.and('contain', `${successPathItems.length} topics available`);
			successPathItems.forEach(scenario => {
				cy.getByAutoId('SuccessCard').should('contain', scenario.archetype)
					.and('contain', scenario.title)
					// Note that type: 'Web Page' gets displayed as 'Web'
					.and('contain', (scenario.type === 'Web Page' ? 'Web' : scenario.type))
					// The UI will only display a duration if it is not null
					.and('contain', (scenario.duration !== null ? scenario.duration : ''));
			});
		});

		it('PBC-142/PBC-143: View All Success Bytes modal includes content type icons', () => {
			successPathItems.forEach((scenario, index) => {
				switch (scenario.type) {
					case 'Video':
						cy.getByAutoId('SuccessCard').eq(index)
							.get('span[class="icon-play-contained icon-small half-padding-right"]')
							.should('exist');
						break;
					case 'Web Page':
						cy.getByAutoId('SuccessCard').eq(index)
							.get('span[class="icon-apps icon-small half-padding-right"]')
							.should('exist');
						break;
					case 'PDF':
						cy.getByAutoId('SuccessCard').eq(index)
							.get('span[class="icon-file-pdf-o icon-small half-padding-right"]')
							.should('exist');
						break;
					case 'Data Sheet':
						// Data Sheet should have document icon
						cy.get('span').should('have.class', 'icon-document');
						break;
					default:
						Cypress.log({
							name: 'LOG',
							message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${scenario.type} ! TREATING AS WEB PAGE...`,
						});
						cy.get('span').should('have.class', 'icon-apps');
				}
				// Should only display a clock icon if there is a duration
				cy.getByAutoId('SuccessCard').eq(index).within(() => {
					if (scenario.duration !== null) {
						cy.get('span[class="icon-clock icon-small half-padding-right"]').should('exist');
					} else {
						cy.get('span[class="icon-clock icon-small half-padding-right"]').should('not.exist');
					}
				});
			});
		});

		it('PBC-199: View All Success Bytes modal should include bookmark ribbons', () => {
			successPathItems.forEach((scenario, index) => {
				cy.getByAutoId('SuccessCard').eq(index).within(() => {
					if (scenario.bookmark) {
						cy.getByAutoId('SBCardRibbon')
							.should('have.class', 'ribbon__blue');
					} else {
						cy.getByAutoId('SBCardRibbon')
							.should('have.class', 'ribbon__clear');
					}
				});
			});
		});
	});

	describe('PBC-16: (UI) View - Solution Based: Success Path Content', () => {
		it('PBC-188: All Success Path content should cross-launch to specified URL', () => {
			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			visibleSuccessPathItems.forEach(scenario => {
				cy.get(`a[href="${scenario.url}"]`).should('contain', scenario.title)
					.and('have.attr', 'target', '_blank');	// target: _blank indicates we'll open in a new tab
			});
		});

		it('PBC-188: All Success Path View All links should cross-launch to specified URL', () => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			successPathItems.forEach(scenario => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.get(`a[href="${scenario.url}"]`)
						// Note that type: 'Web Page' gets displayed as 'Web'
						.should('contain', (scenario.type === 'Web Page' ? 'Web' : scenario.type))
						// target: _blank indicates we'll open in a new tab
						.and('have.attr', 'target', '_blank');
				});
			});

			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});
	});

	describe('PBC-109: (UI) View - Solution Racetrack - Learning - Course Progress', () => {
		after(() => {
			// Ensure we are set back to default mock
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard');
		});

		it('E-Learning/Ceritifcations items should NOT show progress at 0%', () => {
			// Switch mock to one with all elearning/certifications at 0% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-noProgress');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-noProgress');

			// Verify all E-Learning and Certifications items do NOT have progress bar
			cy.getByAutoId('recommendedElearningItem').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('recommendedElearningItem-progressBar').should('not.exist');
				});
			});
		});

		it('E-Learning/Ceritifcations items should show progress at 25%', () => {
			// Switch mock to one with all elearning/certifications at 25% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress25Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress25Percent');

			// Verify all E-Learning and Certifications items have progress bar at 25%
			cy.getByAutoId('recommendedElearningItem').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('recommendedElearningItem-progressBar')
						.should('be.visible')
						.and('have.attr', 'data-percentage', '25');
				});
			});
		});

		it('E-Learning/Ceritifcations items should show progress at 50%', () => {
			// Switch mock to one with all elearning/certifications at 50% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress50Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress50Percent');

			// Verify all E-Learning and Certifications items have progress bar at 50%
			cy.getByAutoId('recommendedElearningItem').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('recommendedElearningItem-progressBar')
						.should('be.visible')
						.and('have.attr', 'data-percentage', '50');
				});
			});
		});

		it('E-Learning/Ceritifcations items should show progress at 75%', () => {
			// Switch mock to one with all elearning/certifications at 75% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress75Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress75Percent');

			// Verify all E-Learning and Certifications items have progress bar at 75%
			cy.getByAutoId('recommendedElearningItem').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('recommendedElearningItem-progressBar')
						.should('be.visible')
						.and('have.attr', 'data-percentage', '75');
				});
			});
		});

		it('E-Learning/Ceritifcations items should show completed at 100%', () => {
			// Switch mock to one with all elearning/certifications at 100% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress100Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress100Percent');

			// Verify all E-Learning and Certifications items have completed icon instead of
			// progress bar
			cy.getByAutoId('recommendedElearningItem').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('recommendedElearningItem-progressBar').should('not.exist');
					cy.getByAutoId('recommendedElearningItem-completedIcon').should('be.visible');
				});
			});
		});
	});

	describe('PBC-110: (UI) View - Solution Racetrack - PBC Exposing Learning Content', () => {
		it('PBC-210: All E-Learning content should cross-launch to specified URL', () => {
			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			visibleELearningItems.forEach(scenario => {
				cy.get(`a[href="${scenario.url}"]`).should('contain', scenario.title)
					.and('have.attr', 'target', '_blank');	// target: _blank indicates we'll open in a new tab
			});
		});

		it('PBC-210: E-Learning View All should cross-launch to digital-learning', () => {
			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			cy.getByAutoId('_ELearning_-ViewAll').should('have.attr', 'href', 'https://pilot-digital-learning.cisco.com/cx/#/?type=e-learning')
				.and('have.attr', 'target', '_blank');	// target: _blank indicates we'll open in a new tab
		});
	});

	describe('PBC-133: Learn: Hover-over to show more content about the module', () => {
		visibleELearningItems.forEach(elearningItem => {
			it(`Should have hover modal on E-Learning links: ${elearningItem.title}`, () => {
				// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
				// that the hover modal and it's elements exist in the DOM. See below for reference:
				// https://docs.cypress.io/api/commands/hover.html#Workarounds
				// https://github.com/cypress-io/cypress/issues/10
				cy.get(`a[href="${elearningItem.url}"]`)
					.should('contain', elearningItem.title)
					.parent()
					.parent()
					.within(() => {
						cy.getByAutoId('recommendedElearning-HoverModal-Title').should('contain', elearningItem.title);
						cy.getByAutoId('recommendedElearning-HoverModal-Description').should('contain', elearningItem.description);
						cy.getByAutoId('recommendedElearning-HoverModal-Rating').should('have.attr', 'ng-reflect-rating', parseFloat(elearningItem.rating).toString());
						// Duration/clock are only displayed if duration is set
						if (elearningItem.duration) {
							cy.getByAutoId('recommendedElearning-HoverModal-DurationClock').should('exist');
							cy.getByAutoId('recommendedElearning-HoverModal-Duration').should('contain', elearningItem.duration);
						} else {
							cy.getByAutoId('recommendedElearning-HoverModal-DurationClock').should('not.exist');
						}
					});
			});
		});
	});

	describe('PBC-198: (UI) View - Lifecycle - Success Bytes - View All Table View', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible');

			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
		});

		after(() => {
			// Switch back to card view
			cy.getByAutoId('card-view-btn').click();

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.be.visible');

			// Reload the page to force-clear any sort/filter
			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();
		});

		it('Success Bytes View All should be able to toggle between table and card views', () => {
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('SuccessCard').should('be.visible');
			cy.getByAutoId('ViewAllTable').should('not.be.visible');

			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('SuccessCard').should('not.be.visible');
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('Success Bytes View All table should have expected columns', () => {
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					cy.get('th').then($columnHeaders => {
						// Should be 5 columns (Bookmark, Name, Category, Format, Action)
						expect($columnHeaders.length).to.eq(5);
					});
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Category').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Format').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Action').should('exist');
				});
		});

		it('Success Bytes View All table should not sort by default', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
							cy.getByAutoId('ViewAllTable-Format-rowValue-link')
								.should('have.attr', 'href', item.url)
								.should('have.attr', 'target', '_blank')
								.within(() => {
									switch (item.type) {
										case 'Video':
											// Video should have play icon
											cy.get('span').should('have.class', 'icon-play-contained');
											break;
										case 'Web Page':
											// Web Page should have grid icon
											cy.get('span').should('have.class', 'icon-apps');
											break;
										case 'PDF':
											// PDF should have PDF icon
											cy.get('span').should('have.class', 'icon-file-pdf-o');
											break;
										case 'Data Sheet':
											// Data Sheet should have document icon
											cy.get('span').should('have.class', 'icon-document');
											break;
										default:
											Cypress.log({
												name: 'LOG',
												message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
											});
											cy.get('span').should('have.class', 'icon-apps');
									}
								});
						});
					});
				});
		});

		it('Success Bytes View All table should be sortable by Name', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['title'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table should be sortable by Category', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Category').click();
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['archetype'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Category').click();
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['archetype'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
						});
					});
				});
		});

		it('Success Bytes View All table should be sortable by Format', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Format').click();
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['type'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Format-rowValue-link')
								.within(() => {
									switch (item.type) {
										case 'Video':
											// Video should have play icon
											cy.get('span').should('have.class', 'icon-play-contained');
											break;
										case 'Web Page':
											// Web Page should have grid icon
											cy.get('span').should('have.class', 'icon-apps');
											break;
										case 'PDF':
											// PDF should have PDF icon
											cy.get('span').should('have.class', 'icon-file-pdf-o');
											break;
										case 'Data Sheet':
											// Data Sheet should have document icon
											cy.get('span').should('have.class', 'icon-document');
											break;
										default:
											Cypress.log({
												name: 'LOG',
												message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
											});
											cy.get('span').should('have.class', 'icon-apps');
									}
								});
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Format').click();
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['type'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Format-rowValue-link')
								.within(() => {
									switch (item.type) {
										case 'Video':
											// Video should have play icon
											cy.get('span').should('have.class', 'icon-play-contained');
											break;
										case 'Web Page':
											// Web Page should have grid icon
											cy.get('span').should('have.class', 'icon-apps');
											break;
										case 'PDF':
											// PDF should have PDF icon
											cy.get('span').should('have.class', 'icon-file-pdf-o');
											break;
										case 'Data Sheet':
											// Data Sheet should have document icon
											cy.get('span').should('have.class', 'icon-document');
											break;
										default:
											Cypress.log({
												name: 'LOG',
												message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
											});
											cy.get('span').should('have.class', 'icon-apps');
									}
								});
						});
					});
				});
		});

		successPathArchetypes.forEach(archetype => {
			it(`View All Success Bytes modal (table view) can filter by archetype: ${archetype}`, () => {
				// Filter by archetype, verify the count
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = successPathItems.filter(item => (item.archetype === archetype));
					cy.getByAutoId('ViewAllTable')
						.should('be.visible')
						.within(() => {
							cy.get('tr').then(rows => {
								// Note that the first tr is the column headers
								expect(rows.length - 1).to.eq(filteredItems.length);
							});
						});
				});
			});
		});

		it('View All Success Bytes modal (table view)  can filter by archetype: Not selected', () => {
			// Filter by archetype, verify the count. Note: 'Not selected' should show all items
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(successPathItems.length);
						});
					});
			});
		});

		it('View All Success Bytes modal table view should support sort and filter combined', () => {
			// Filter by archetype "Project Planning"
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();

				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});

						// Sort by name, verify the filter is still in place, and verify we sort within the
						// existing filter
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();

						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});

						const sortedItemsAsc = Cypress._.orderBy(filteredItems, ['title'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});

						// Reverse the sort and re-verify filter and order
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();

						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});

						const sortedItemsDesc = Cypress._.orderBy(filteredItems, ['title'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});
		});
	});

	// TODO: Broken due to the generic changes to the View All modal
	// table vs. card view is currently not sticky at all...
	describe('PBC-198: Success Bytes View All table sorting stickiness', () => {
		beforeEach(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
		});

		afterEach(() => {
			// Switch back to card view
			cy.getByAutoId('card-view-btn').click();

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('Success Bytes View All table sort should be sticky across modal close/re-open', () => {
			const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);

			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the still in table view and sort is still in place
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should be sticky across table/card view', () => {
			const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);

			// Sort the data
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Switch to card view, verify the sort is still in place
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ViewAllModal').within(() => {
				sortedItemsAsc.forEach((item, index) => {
					cy.getByAutoId('SuccessCard')
						.eq(index)
						.should('contain', item.title);
				});
			});

			// Switch back to table view, verify sort is still in place
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should NOT be sticky across use case changes', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify still in table view and sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
				});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});
	});

	describe('PBC-199: (UI) View - Lifecycle - Product Guides - Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
		});

		after(() => {
			cy.getByAutoId('SuccessPathCloseModal').click();

			// Reload the page to force-reset any changed bookmarks
			// This is required since the mock bookmark APIs don't actually bookmark the ACC items
			cy.loadApp();
			cy.waitForAppLoading();

			// Wait for the ACC panel to finish loading
			cy.waitForAppLoading('successPathsLoading', 15000);

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();
		});

		it('Should be able to bookmark a Success Bytes item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				successPathItems.forEach((item, index) => {
					if (!item.bookmark) {
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__clear')
							.click();
						// Wait for the Bookmark mock to be called
						cy.wait('(SB) IBN-Bookmark');
						cy.waitForAppLoading('successPathsLoading', 5000);
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue');
					}
				});
			});
		});

		it('Should be able to UN-bookmark a Success Bytes item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				successPathItems.forEach((item, index) => {
					if (item.bookmark) {
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue')
							.click();
						// Wait for the Bookmark mock to be called
						cy.wait('(SB) IBN-Bookmark');
						cy.waitForAppLoading('successPathsLoading', 5000);
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__clear');
					}
				});
			});
		});
	});

	describe('PBC-200: (UI) View - Lifecycle - Success Bytes - Filter by Category', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		after(() => {
			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('View All Success Bytes modal shows all archetypes by default', () => {
			// Verify all cards are displayed by default
			cy.getByAutoId('SuccessCard').then(cards => {
				expect(cards.length).to.eq(successPathItems.length);
			});
		});

		successPathArchetypes.forEach(archetype => {
			it(`View All Success Bytes modal (card view) can filter by archetype: ${archetype}`, () => {
				// Filter by archetype, verify the count
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = successPathItems.filter(item => (item.archetype === archetype));
					cy.getByAutoId('SuccessCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});
		});

		it('View All Success Bytes modal (card view) can filter by archetype: Not selected', () => {
			// Filter by archetype, verify the count. Note: 'Not selected' should show all items
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});

		it('View All Success Bytes modal filter should be searchable', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				// Start typing an archetype in the filter field
				cy.getByAutoId('cui-select').click()
					.get('input')
					.type('Gett');
				cy.get('cui-vscroll-viewport').within(() => {
					// Verify the filters have been filtered to match the input
					cy.get('a').then($filters => {
						$filters.toArray().forEach($filter => {
							cy.wrap($filter).should('have.attr', 'title')
								.and('contain', 'Gett');
						});
					});
				});
			});
		});

		it('View All Success Bytes modal filter should be clearable', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Getting Started"]').click();

				cy.getByAutoId('SuccessCard').then(cards => {
					const filteredItems = successPathItems.filter(item => (item.archetype === 'Getting Started'));
					expect(cards.length).to.eq(filteredItems.length);
				});

				// Click the clear filter button, should show all items again
				cy.getByAutoId('category-filter').within(() => {
					cy.get('span[class="icon-close"]').click();
				});

				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});
	});

	describe('PBC-354: Verify View All filter stickiness', () => {
		beforeEach(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		afterEach(() => {
			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('View All Success Bytes filter should be sticky', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter is still in place
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All Success Bytes filter should NOT be sitcky across use case changes', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, change use cases, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.getByAutoId('SuccessCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('View All Success Bytes filter should NOT be sitcky across page navigation', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.getByAutoId('SuccessCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('View All Success Bytes filter should NOT be sitcky across page reload', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			// Close the setup wizard so it doesn't block other elements
			cy.getByAutoId('setup-wizard-header-close-btn').click();

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.getByAutoId('SuccessCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('PBC-198: View All Success Bytes filter should be sticky across table/card view', () => {
			// Apply the filter
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Switch to table view, verify the filter is still in place
			cy.getByAutoId('table-view-btn').click();
			const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
			cy.getByAutoId('ViewAllTable')
				.should('be.visible')
				.within(() => {
					cy.get('tr').then(rows => {
						// Note that the first tr is the column headers
						expect(rows.length - 1).to.eq(filteredItems.length);
					});
				});

			// Switch back to card view, verify the filter is still in place
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});
	});

	describe('PBC-459: (UI) View - Lifecycle - All Product Documentation and Videos', () => {
		it('Success Bytes section should include link to all docs', () => {
			cy.getByAutoId('Success Bytes Panel').within(() => {
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').should('be.visible');
			});
			cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
			cy.getByAutoId('ViewAllModal').should('be.visible').within(() => {
				cy.getByAutoId('ViewAllModal-Title').should('have.text', i18n._ProductGuides_);
				cy.getByAutoId('SuccessPathCloseModal').click();
			});
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		describe('Card View', () => {
			before(() => {
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');
			});

			after(() => {
				// Close the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the data to reset any bookmark changes
				cy.loadApp();
				cy.wait('Product Documenation & Videos response for all');

				// Close the setup wizard so it doesn't block other elements
				cy.getByAutoId('setup-wizard-header-close-btn').click();
			});

			it('All product guides modal card view should contain all items', () => {
				allProductGuidesItems.forEach((item, index) => {
					cy.getByAutoId('ProductGuidesCard').eq(index).within(() => {
						cy.getByAutoId('ProductGuidesCard-Archetype').should('have.text', item.archetype);
						cy.getByAutoId('ProductGuidesCard-Title').should('have.text', item.title);
						cy.getByAutoId('productlink')
							.should('have.attr', 'href', item.url)
							.and('have.attr', 'target', '_blank');
						// Handle duration text and clock icon
						cy.getByAutoId('ProductGuidesCard-Duration').should('contain', item.duration);
						cy.getByAutoId('ProductGuidesCard-Duration')
							.get('.icon-clock')
							.should('exist');
						// Handle content type
						switch (item.type) {
							case 'Video':
								cy.get('span[class="icon-play-contained icon-small half-padding-right"]')
									.should('exist');
								break;
							case 'Web Page':
								cy.get('span[class="icon-apps icon-small half-padding-right"]')
									.should('exist');
								break;
							case 'PDF':
								cy.get('span[class="icon-file-pdf-o icon-small half-padding-right"]')
									.should('exist');
								break;
							case 'Data Sheet':
								// Data Sheet should have document icon
								cy.get('span').should('have.class', 'icon-document');
								break;
							default:
								Cypress.log({
									name: 'LOG',
									message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
								});
								cy.get('span').should('have.class', 'icon-apps');
						}
						// Handle bookmark ribbon
						if (item.bookmark) {
							cy.getByAutoId('ProductGuidesCard-Ribbon').should('have.class', 'ribbon__blue');
						} else {
							cy.getByAutoId('ProductGuidesCard-Ribbon').should('have.class', 'ribbon__clear');
						}
					});
				});
			});

			it('All product guides modal card view can bookmark items', () => {
				allProductGuidesItems.forEach((item, index) => {
					if (!item.bookmark) {
						cy.getByAutoId('ProductGuidesCard')
							.eq(index)
							.within(() => {
								cy.getByAutoId('ProductGuidesCard-Ribbon')
									.click();
								cy.wait('(SB) IBN-Bookmark');
								cy.getByAutoId('ProductGuidesCard-Ribbon')
									.should('have.class', 'ribbon__blue');
							});
					}
				});
			});

			it('All product guides modal card view can un-bookmark items', () => {
				allProductGuidesItems.forEach((item, index) => {
					if (item.bookmark) {
						cy.getByAutoId('ProductGuidesCard')
							.eq(index)
							.within(() => {
								cy.getByAutoId('ProductGuidesCard-Ribbon')
									.click();
								cy.wait('(SB) IBN-Bookmark');
								cy.getByAutoId('ProductGuidesCard-Ribbon')
									.should('have.class', 'ribbon__clear');
							});
					}
				});
			});
		});

		describe('Table View', () => {
			before(() => {
				// Open the modal and switch to table view
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			after(() => {
				// Switch to back to card view and close the modal
				cy.getByAutoId('card-view-btn').click();
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Refresh the data to reset any bookmark changes
				cy.loadApp();
				cy.wait('Product Documenation & Videos response for all');

				// Close the setup wizard so it doesn't block other elements
				cy.getByAutoId('setup-wizard-header-close-btn').click();
			});

			it('All product guides modal table view should have expected columns', () => {
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						cy.get('th').then($columnHeaders => {
							// Should be 4 columns (Bookmark, Name, Category, Format, Action)
							expect($columnHeaders.length).to.eq(5);
						});
						cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Category').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Format').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Action').should('exist');
					});
			});

			it('All product guides modal table view should contain all items', () => {
				allProductGuidesItems.forEach((item, index) => {
					cy.getByAutoId('ViewAllTable').within(() => {
						// Increase index by 1, since the first tr has the column headers
						cy.get('tr').eq(index + 1).within(() => {
							cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
							cy.getByAutoId('ViewAllTable-Format-rowValue-link')
								.should('have.attr', 'href', item.url)
								.and('have.attr', 'target', '_blank');
							// Handle duration text and clock icon
							cy.getByAutoId('ViewAllTable-Format-rowValue-duration').should('contain', item.duration);
							cy.getByAutoId('ViewAllTable-Format-rowValue-clock').should('exist');
							// Handle content type
							switch (item.type) {
								case 'Video':
									cy.get('span[class="icon-play-contained icon-small half-padding-right"]')
										.should('exist');
									break;
								case 'Web Page':
									cy.get('span[class="icon-apps icon-small half-padding-right"]')
										.should('exist');
									break;
								case 'PDF':
									cy.get('span[class="icon-file-pdf-o icon-small half-padding-right"]')
										.should('exist');
									break;
								case 'Data Sheet':
									// Data Sheet should have document icon
									cy.get('span').should('have.class', 'icon-document');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
									});
									cy.get('span').should('have.class', 'icon-apps');
							}
							// Handle bookmark ribbon
							if (item.bookmark) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'text-indigo');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark-clear');
							}
						});
					});
				});
			});

			it('All product guides modal table view should be sortable by Name', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
						const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});

						// Reverse the sort and re-verify order
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
						const sortedItemsDesc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table view should be sortable by Category', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Category').click();
						const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['archetype'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
							});
						});

						// Reverse the sort and re-verify order
						cy.getByAutoId('ViewAllTable-columnHeader-Category').click();
						const sortedItemsDesc = Cypress._.orderBy(allProductGuidesItems, ['archetype'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
							});
						});
					});
			});

			it('All product guides modal table view should be sortable by Format', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Format').click();
						const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['type'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Format-rowValue-link')
									.within(() => {
										switch (item.type) {
											case 'Video':
												// Video should have play icon
												cy.get('span').should('have.class', 'icon-play-contained');
												break;
											case 'Web Page':
												// Web Page should have grid icon
												cy.get('span').should('have.class', 'icon-apps');
												break;
											case 'PDF':
												// PDF should have PDF icon
												cy.get('span').should('have.class', 'icon-file-pdf-o');
												break;
											case 'Data Sheet':
												// Data Sheet should have document icon
												cy.get('span').should('have.class', 'icon-document');
												break;
											default:
												Cypress.log({
													name: 'LOG',
													message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
												});
												cy.get('span').should('have.class', 'icon-apps');
										}
									});
							});
						});

						// Reverse the sort and re-verify order
						cy.getByAutoId('ViewAllTable-columnHeader-Format').click();
						const sortedItemsDesc = Cypress._.orderBy(allProductGuidesItems, ['type'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Format-rowValue-link')
									.within(() => {
										switch (item.type) {
											case 'Video':
												// Video should have play icon
												cy.get('span').should('have.class', 'icon-play-contained');
												break;
											case 'Web Page':
												// Web Page should have grid icon
												cy.get('span').should('have.class', 'icon-apps');
												break;
											case 'PDF':
												// PDF should have PDF icon
												cy.get('span').should('have.class', 'icon-file-pdf-o');
												break;
											case 'Data Sheet':
												// Data Sheet should have document icon
												cy.get('span').should('have.class', 'icon-document');
												break;
											default:
												Cypress.log({
													name: 'LOG',
													message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
												});
												cy.get('span').should('have.class', 'icon-apps');
										}
									});
							});
						});
					});
			});

			allProductGuidesArchetypes.forEach(archetype => {
				it(`All product guides modal table view can filter by archetype: ${archetype}`, () => {
					// Filter by archetype, verify the count
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = allProductGuidesItems.filter(
						item => (item.archetype === archetype)
					);
					cy.getByAutoId('ViewAllTable')
						.should('be.visible')
						.within(() => {
							cy.get('tr').then(rows => {
								// Note that the first tr is the column headers
								expect(rows.length - 1).to.eq(filteredItems.length);
							});
						});
				});
			});

			it('All product guides modal table view can filter by archetype: Not selected', () => {
				// Filter by archetype, verify the count. Note: 'Not selected' should show all items
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(allProductGuidesItems.length);
						});
					});
			});

			it('All product guides modal table view can bookmark items', () => {
				allProductGuidesItems.forEach((item, index) => {
					if (!item.bookmark) {
						cy.getByAutoId('ViewAllTable').within(() => {
							// Increase index by 1, since the first tr has the column headers
							cy.get('tr').eq(index + 1).within(() => {
								cy.getByAutoId('SBListRibbon')
									.click();
								cy.wait('(SB) IBN-Bookmark');
								cy.getByAutoId('SBListRibbon')
									.should('have.class', 'text-indigo');
							});
						});
					}
				});
			});

			it('All product guides modal table view can un-bookmark items', () => {
				allProductGuidesItems.forEach((item, index) => {
					if (item.bookmark) {
						cy.getByAutoId('ViewAllTable').within(() => {
							// Increase index by 1, since the first tr has the column headers
							cy.get('tr').eq(index + 1).within(() => {
								cy.getByAutoId('SBListRibbon')
									.click();
								cy.wait('(SB) IBN-Bookmark');
								cy.getByAutoId('SBListRibbon')
									.should('have.class', 'icon-bookmark-clear');
							});
						});
					}
				});
			});
		});

		describe('Sorting Stickiness', () => {
			beforeEach(() => {
				// Open the modal and switch to table view
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			afterEach(() => {
				// Switch to back to card view and close the modal
				cy.getByAutoId('card-view-btn').click();
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Make sure we're on the lifecycle page and the default use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Documenation & Videos response for all');
			});

			it('All product guides modal table sort should be sticky across modal close/re-open', () => {
				const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['asc']);

				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					});

				// Close and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the still in table view and sort is still in place
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal sort should be sticky across table/card view', () => {
				const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['asc']);

				// Sort the data
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					});

				// Switch to card view, verify the sort is still in place
				cy.getByAutoId('card-view-btn').click();
				cy.getByAutoId('ViewAllModal').within(() => {
					sortedItemsAsc.forEach((item, index) => {
						cy.getByAutoId('ProductGuidesCard-Title')
							.eq(index)
							.should('have.text', item.title);
					});
				});

				// Switch back to table view, verify sort is still in place
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table sort should NOT be sticky across use case changes', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					});

				// Close the modal, switch use cases, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify still in table view and sort was reset to default
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						allProductGuidesItems.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table sort should NOT be sticky across page navigation', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					});

				// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Documenation & Videos response for all');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the sort was reset to default
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						allProductGuidesItems.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table sort should NOT be sticky across page reload', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click();
					});

				// Close the modal, reload the page, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.loadApp();
				cy.wait('Product Documenation & Videos response for all');

				// Close the setup wizard so it doesn't block other elements
				cy.getByAutoId('setup-wizard-header-close-btn').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the sort was reset to default
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						allProductGuidesItems.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('ViewAllTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});
		});

		describe('Filter Stickiness', () => {
			beforeEach(() => {
				// Open the View All modal
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');
			});

			afterEach(() => {
				// Close the View All modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Make sure we're on the lifecycle page and the default use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Documenation & Videos response for all');
			});

			it('All product guides modal filter should be sticky across modal close/re-open', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click();
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the filter is still in place
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
					const filteredItems = allProductGuidesItems.filter(item => (item.archetype === 'Project Planning'));
					cy.getByAutoId('ProductGuidesCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});

			it('All product guides modal filter should NOT be sticky across use case changes', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click();
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close the modal, change use cases, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
				cy.wait('Product Documenation & Videos response for all');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the filter was cleared and all items are displayed
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
				cy.getByAutoId('ProductGuidesCard').then($cards => {
					expect($cards.length).to.eq(allProductGuidesItems.length);
				});
			});

			it('All product guides modal filter should NOT be sticky across page navigation', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click();
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Documenation & Videos response for all');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the filter was cleared and all items are displayed
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
				cy.getByAutoId('ProductGuidesCard').then($cards => {
					expect($cards.length).to.eq(allProductGuidesItems.length);
				});
			});

			it('All product guides modal filter should NOT be sticky across page reload', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click();
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close the modal, reload the page, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.loadApp();
				cy.wait('Product Documenation & Videos response for all');

				// Close the setup wizard so it doesn't block other elements
				cy.getByAutoId('setup-wizard-header-close-btn').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify the filter was cleared and all items are displayed
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
				cy.getByAutoId('ProductGuidesCard').then($cards => {
					expect($cards.length).to.eq(allProductGuidesItems.length);
				});
			});

			it('All product guides modal filter should be sticky across table/card view', () => {
				// Apply the filter
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click();
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Switch to table view, verify the filter is still in place
				cy.getByAutoId('table-view-btn').click();
				const filteredItems = allProductGuidesItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('ViewAllTable')
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});
					});

				// Switch back to card view, verify the filter is still in place
				cy.getByAutoId('card-view-btn').click();
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
					cy.getByAutoId('ProductGuidesCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});
		});

		describe('Table vs. Card View Stickiness', () => {
			beforeEach(() => {
				// Open the modal and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');
				cy.getByAutoId('card-view-btn').click();
				cy.getByAutoId('ProductGuidesCard').should('be.visible');
			});

			afterEach(() => {
				// Switch to back to card view and close the modal
				cy.getByAutoId('card-view-btn').click();
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Make sure we're on the lifecycle page and the default use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Documenation & Videos response for all');
			});

			it('All product guides modal table vs. card view should be sticky across modal close/re-open', () => {
				// Switch to table view
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('be.visible');

				// Close and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			it('All product guides modal table vs. card view should be sticky across usecase change', () => {
				// Switch to table view
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('be.visible');

				// Close the modal, switch use cases, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			it('All product guides modal table vs. card view should be sticky across page navigation', () => {
				// Switch to table view
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('be.visible');

				// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Documenation & Videos response for all');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});

			it('All product guides modal table vs. card view should be sticky across page reload', () => {
				// Switch to table view
				cy.getByAutoId('table-view-btn').click();
				cy.getByAutoId('ViewAllTable').should('be.visible');

				// Close the modal, reload the page, and re-open the modal
				cy.getByAutoId('SuccessPathCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.loadApp();
				cy.wait('Product Documenation & Videos response for all');

				// Close the setup wizard so it doesn't block other elements
				cy.getByAutoId('setup-wizard-header-close-btn').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('ViewAllModal').should('be.visible');

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('be.visible');
			});
		});
	});
});
