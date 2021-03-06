import MockService from '../support/mockService';

const elearningMock = new MockService('ELearningScenarios');
const elearningOnboardScenario = elearningMock.getScenario('GET', '(E-Learning) IBN-Campus Network Assurance-Onboard');
const elearningItems = elearningOnboardScenario.response.body.items;

const successPathMock = new MockService('SuccessPathScenarios');
const successPathOnboardScenario = successPathMock.getScenario('GET', '(SP) IBN-Campus Network Assurance-Onboard');
const successPathItems = successPathOnboardScenario.response.body.items;

const allProductGuidesScenario = successPathMock.getScenario('GET', 'Product Guides IBN - Campus Network Assurance');
const allProductGuidesItems = allProductGuidesScenario.response.body.items;
const campusNetSegmentationScenario = successPathMock
	.getScenario('GET', 'Product Guides IBN - Campus Network Segmentation');
const campusNetSegmentationGuides = campusNetSegmentationScenario.response.body.items;

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
		cy.window().then(win => { // must be done before the app loads
			win.sessionStorage.clear(); // reset view preferences back to defaults
		});
		cy.login();
		cy.loadApp();

		// Disable the setup wizard and quick tour so they don't block other elements
		cy.window().then(win => { // must be done after the app loads
			win.Cypress.hideDNACHeader = true;
			win.Cypress.showQuickTour = false;
		});

		cy.waitForAppLoading();

		// TODO: For some reason, waiting for these back to back is extremely flaky...
		// Wait for both E-Learning and Success Paths to finish loading
		// cy.waitForAppLoading('elearningLoading', 15000);
		cy.waitForAppLoading('successPathsLoading', 15000);
	});

	describe('PBC-125 Learning Content', () => {
		it('Learning panel should be displayed', () => {
			cy.getByAutoId('PanelTitle-_Learn_').should('have.text', 'Learn');
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
				cy.getByAutoId('Success Tips Panel').should('exist')
					.and('contain', 'Success Tips')
					.and('contain', 'Resources to fine-tune your tech');
			} else {
				cy.getByAutoId('Success Tips Panel').should('not.exist');
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
				cy.getByAutoId('Success Tips Panel')
					.should('contain', scenario.title);
			});
			invisibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('Success Tips Panel')
					.should('not.contain', scenario.title);
			});
		});
	});

	describe('PBC-15: (UI) View - Lifecycle - Success Tips - View All Card View', () => {
		beforeEach(() => {
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		afterEach(() => {
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('PBC-142/PBC-143: View All Success Tips link should open modal with all results', () => {
			cy.getByAutoId('ViewAllModal').should('exist')
				.and('contain', 'Success Tips')
				.and('contain', 'Resources to fine-tune your tech')
				.and('contain', `${successPathItems.length} topics available`);
			successPathItems.forEach((scenario, index) => {
				cy.getByAutoId('SBCard')
					.eq(index)
					.within($card => {
						cy.getByAutoId('SBCardArchetype').should('have.text', scenario.archetype);
						cy.getByAutoId('successtitle')
							.should('have.attr', 'href', scenario.url)
							.and('have.attr', 'target', '_blank');
						cy.getByAutoId('SBCardTitle')
							.should('have.text', scenario.title)
							.and('have.class', 'title-line-clamp');
						cy.getByAutoId('SBCardDescription')
							.should('have.text', scenario.description)
							.and('have.class', 'desc-line-clamp');
						cy.wrap($card)
							// Note that type: 'Web Page' gets displayed as 'Web'
							.should('contain', (scenario.type === 'Web Page' ? 'Web' : scenario.type))
							// The UI will only display a duration if it is not null
							.and('contain', (scenario.duration !== null ? scenario.duration : ''));
					});
			});
		});

		it('PBC-142/PBC-143: View All Success Tips modal includes content type icons', () => {
			successPathItems.forEach((scenario, index) => {
				cy.getByAutoId('SBCard').eq(index).within(() => {
					switch (scenario.type) {
						case 'Video':
							// Video should have play icon
							cy.get('.icon-video')
								.should('exist');
							break;
						case 'Web Page':
							cy.get('.icon-link')
								.should('exist');
							break;
						case 'PDF':
							cy.get('.icon-file-pdf-o')
								.should('exist');
							break;
						case 'Data Sheet':
							// Data Sheet should have document icon
							cy.get('.icon-file-o')
								.should('exist');
							break;
						default:
							Cypress.log({
								name: 'LOG',
								message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${scenario.type} ! TREATING AS WEB PAGE...`,
							});
							cy.get('.icon-link')
								.should('exist');
					}
					// Should only display a clock icon if there is a duration
					if (scenario.duration !== null) {
						cy.get('span[class="icon-clock qtr-padding-right"]').should('exist');
					} else {
						cy.get('span[class="icon-clock qtr-padding-right"]').should('not.exist');
					}
				});
			});
		});

		it('PBC-199: View All Success Tips modal should include bookmark ribbons', () => {
			successPathItems.forEach((scenario, index) => {
				cy.getByAutoId('SBCard').eq(index).within(() => {
					if (scenario.bookmark) {
						cy.getByAutoId('SBCardRibbon')
							.should('have.class', 'ribbon__blue');
					} else {
						cy.getByAutoId('SBCardRibbon')
							.should('have.class', 'ribbon__white');
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
				cy.get(`a[href="${scenario.url}"]`)
					.should('have.attr', 'target', '_blank'); // target: _blank indicates we'll open in a new tab
			});
		});

		it('PBC-188: All Success Path View All links should cross-launch to specified URL', () => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			successPathItems.forEach((scenario, index) => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('SBCard').eq(index).within(() => {
						// PBC-567 Title and Launch button should have link to new tab
						cy.getByAutoId('successtitle')
							.should('have.text', scenario.title)
							.and('have.attr', 'href', scenario.url)
							.and('have.attr', 'target', '_blank');
						cy.getByAutoId('LaunchButton')
							.should('exist')
							.and('have.text', i18n._View_)
							.parent()
							.should('have.attr', 'href', scenario.url)
							.and('have.attr', 'target', '_blank');
					});
				});
			});

			cy.getByAutoId('ViewAllCloseModal').click();
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

		it('E-Learning/Certifications items should NOT show progress at 0%', () => {
			// Switch mock to one with all elearning/certifications at 0% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-noProgress');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-noProgress');

			// Verify all E-Learning and Certifications items do NOT have progress bar
			cy.getByAutoId('_ELearning_-Item').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('_ELearning_-progressBar').should('not.exist');
				});
			});
		});

		it('E-Learning/Certifications items should show progress at 25%', () => {
			// Switch mock to one with all elearning/certifications at 25% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress25Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress25Percent');

			// Verify all E-Learning and Certifications items have progress bar at 25%
			cy.getByAutoId('_ELearning_-Item').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('_ELearning_-progressBar')
						.should('be.visible')
						.and('have.attr', 'data-percentage', '25');
				});
			});
		});

		it('E-Learning/Certifications items should show progress at 50%', () => {
			// Switch mock to one with all elearning/certifications at 50% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress50Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress50Percent');

			// Verify all E-Learning and Certifications items have progress bar at 50%
			cy.getByAutoId('_ELearning_-Item').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('_ELearning_-progressBar')
						.should('be.visible')
						.and('have.attr', 'data-percentage', '50');
				});
			});
		});

		it('E-Learning/Certifications items should show progress at 75%', () => {
			// Switch mock to one with all elearning/certifications at 75% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress75Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress75Percent');

			// Verify all E-Learning and Certifications items have progress bar at 75%
			cy.getByAutoId('_ELearning_-Item').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('_ELearning_-progressBar')
						.should('be.visible')
						.and('have.attr', 'data-percentage', '75');
				});
			});
		});

		it('E-Learning/Certifications items should show completed at 100%', () => {
			// Switch mock to one with all elearning/certifications at 100% progress
			elearningMock.enable('(E-Learning) IBN-Campus Network Assurance-Onboard-progress100Percent');

			// Reload the data
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(E-Learning) IBN-Campus Network Assurance-Onboard-progress100Percent');

			// Verify all E-Learning and Certifications items have completed icon instead of
			// progress bar
			cy.getByAutoId('_ELearning_-Item').each($elearningLink => {
				cy.wrap($elearningLink).within(() => {
					cy.getByAutoId('_ELearning_-progressBar').should('not.exist');
					cy.getByAutoId('_ELearning_-completedIcon').should('be.visible');
				});
			});
		});
	});

	describe('PBC-110: (UI) View - Solution Racetrack - PBC Exposing Learning Content', () => {
		it('PBC-210: E-Learning View All should cross-launch to digital-learning', () => {
			cy.getByAutoId('_ELearning_-ViewAll')
				.should(
					'have.attr', 'data-auto-href',
					'https://pilot-digital-learning.cisco.com/cx/#/?type=e-learning',
				);
		});
	});

	describe('PBC-133: Learn: Hover-over to show more content about the module', () => {
		visibleELearningItems.forEach((elearningItem, index) => {
			it(`Should have hover modal on E-Learning links: ${elearningItem.title}`, () => {
				// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
				// that the hover modal and it's elements exist in the DOM. See below for reference:
				// https://docs.cypress.io/api/commands/hover.html#Workarounds
				// https://github.com/cypress-io/cypress/issues/10
				cy.getByAutoId('_ELearning_-Item')
					.eq(index)
					.should('contain', elearningItem.title)
					.within(() => {
						cy.getByAutoId('recommendedElearning-HoverModal-Title')
							.should('contain', elearningItem.title)
							.and('have.class', 'title-line-clamp');
						cy.getByAutoId('recommendedElearning-HoverModal-Description')
							.should('contain', elearningItem.description)
							// PBC-611 Truncate description text
							// Since this handled by the styles, just validate the class exists
							.and('have.class', 'line-clamp');
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

	describe('PBC-198: (UI) View - Lifecycle - Success Tips - View All Table View', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();

			// Switch to table view
			cy.getByAutoId('sb-table-view-btn').click({ force: true });
		});

		after(() => {
			// Switch back to card view
			cy.window().then(win => {
				win.sessionStorage.clear(); // reset back to default card view
			});

			// Reload the page to force-clear any sort/filter
			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('Success Tips View All should be able to toggle between table and card views', () => {
			cy.getByAutoId('sb-card-view-btn').click({ force: true });
			cy.getByAutoId('SBCard').should('be.visible');
			cy.getByAutoId('ViewAllTable').should('not.be.visible');

			cy.getByAutoId('sb-table-view-btn').click({ force: true });
			cy.getByAutoId('SBCard').should('not.be.visible');
			cy.getByAutoId('ViewAllTable').should('be.visible');
		});

		it('Success Tips View All table should have expected columns', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.get('th').then($columnHeaders => {
						// Should be 4 column headers (Bookmark, Name, Category, Format)
						expect($columnHeaders.length).to.eq(5);
					});
					cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Category').should('exist');
					cy.getByAutoId('ViewAllTable-columnHeader-Format').should('exist');
				});
		});

		it('Success Tips View All table should not sort by default', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
							cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
							// PBC-567 Title and Launch button should have link to new tab
							cy.getByAutoId('SB-Name-rowValue')
								.should('have.text', item.title)
								.and('have.attr', 'href', item.url)
								.and('have.attr', 'target', '_blank');
							cy.getByAutoId('LaunchButton')
								.should('exist')
								.and('have.text', i18n._View_)
								.parent()
								.should('have.attr', 'href', item.url)
								.and('have.attr', 'target', '_blank');
							switch (item.type) {
								case 'Video':
									// Video should have play icon
									cy.get('span').should('have.class', 'icon-video');
									break;
								case 'Web Page':
									// Web Page should have grid icon
									cy.get('span').should('have.class', 'icon-link');
									break;
								case 'PDF':
									// PDF should have PDF icon
									cy.get('span').should('have.class', 'icon-file-pdf-o');
									break;
								case 'Data Sheet':
									// Data Sheet should have document icon
									cy.get('span').should('have.class', 'icon-file-o');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
									});
									cy.get('span').should('have.class', 'icon-link');
							}
						});
					});
				});
		});

		it('Success Tips View All table should be sortable by Name', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['title'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Tips View All table should be sortable by Category', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Category').click({ force: true });
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
					cy.getByAutoId('ViewAllTable-columnHeader-Category').click({ force: true });
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

		it('Success Tips View All table should be sortable by Format', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Format').click({ force: true });
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['type'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							switch (item.type) {
								case 'Video':
									// Video should have play icon
									cy.get('span').should('have.class', 'icon-video');
									break;
								case 'Web Page':
									// Web Page should have grid icon
									cy.get('span').should('have.class', 'icon-link');
									break;
								case 'PDF':
									// PDF should have PDF icon
									cy.get('span').should('have.class', 'icon-file-pdf-o');
									break;
								case 'Data Sheet':
									// Data Sheet should have document icon
									cy.get('span').should('have.class', 'icon-file-o');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
									});
									cy.get('span').should('have.class', 'icon-link');
							}
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('ViewAllTable-columnHeader-Format').click({ force: true });
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['type'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							switch (item.type) {
								case 'Video':
									// Video should have play icon
									cy.get('span').should('have.class', 'icon-video');
									break;
								case 'Web Page':
									// Web Page should have grid icon
									cy.get('span').should('have.class', 'icon-link');
									break;
								case 'PDF':
									// PDF should have PDF icon
									cy.get('span').should('have.class', 'icon-file-pdf-o');
									break;
								case 'Data Sheet':
									// Data Sheet should have document icon
									cy.get('span').should('have.class', 'icon-file-o');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
									});
									cy.get('span').should('have.class', 'icon-link');
							}
						});
					});
				});
		});

		successPathArchetypes.forEach(archetype => {
			it(`View All Success Tips modal (table view) can filter by archetype: ${archetype}`, () => {
				// Filter by archetype, verify the count
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = successPathItems.filter(item => (item.archetype === archetype));
					cy.getByAutoId('ViewAllTable')
						.within(() => {
							cy.get('tr').then(rows => {
								// Note that the first tr is the column headers
								expect(rows.length - 1).to.eq(filteredItems.length);
							});
						});
				});
			});
		});

		it('View All Success Tips modal (table view)  can filter by archetype: Not selected', () => {
			// Filter by archetype, verify the count. Note: 'Not selected' should show all items
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(successPathItems.length);
						});
					});
			});
		});

		it('View All Success Tips modal table view should support sort and filter combined', () => {
			// Filter by archetype "Project Planning"
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click({ force: true });

				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});

						// Sort by name, verify the filter is still in place, and verify we sort within the
						// existing filter
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });

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
								cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
							});
						});

						// Reverse the sort and re-verify filter and order
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });

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
								cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});
		});
	});

	describe('PBC-198: Success Tips View All table sorting stickiness', () => {
		beforeEach(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Switch to table view
			cy.getByAutoId('sb-table-view-btn').click({ force: true });
		});

		afterEach(() => {
			// Switch back to card view
			cy.getByAutoId('sb-card-view-btn').click({ force: true });

			// Close the View All modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('Success Tips View All table sort should be sticky across modal close/re-open', () => {
			const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);

			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
				});

			// Close and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the still in table view and sort is still in place
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Tips View All table sort should be sticky across table/card view', () => {
			const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);

			// Sort the data
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
				});

			// Switch to card view, verify the sort is still in place
			cy.getByAutoId('sb-card-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllModal').within(() => {
				sortedItemsAsc.forEach((item, index) => {
					cy.getByAutoId('SBCard')
						.eq(index)
						.should('contain', item.title);
				});
			});

			// Switch back to table view, verify sort is still in place
			cy.getByAutoId('sb-table-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Tips View All table sort should NOT be sticky across use case changes', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
				});

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify still in table view and sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Tips View All table sort should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
				});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Tips View All table sort should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
				});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the sort was reset to default
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SB-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});
	});

	describe('PBC-199: (UI) View - Lifecycle - Product Guides - Status Ribbons', () => {
		before(() => {
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
		});

		after(() => {
			cy.getByAutoId('ViewAllCloseModal').click();

			// Reload the page to force-reset any changed bookmarks
			// This is required since the mock bookmark APIs don't actually bookmark the ACC items
			cy.loadApp();
			cy.waitForAppLoading();

			// Wait for the ACC panel to finish loading
			cy.waitForAppLoading('successPathsLoading', 15000);
		});

		it('Should be able to bookmark a Success Tips item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				successPathItems.forEach((item, index) => {
					if (!item.bookmark) {
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__white')
							.click();
						// Wait for the Bookmark mock to be called
						cy.waitForAppLoading('elearningLoading');
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue');
					}
				});
			});
		});

		it('Should be able to UN-bookmark a Success Tips item', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				successPathItems.forEach((item, index) => {
					if (item.bookmark) {
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__blue')
							.click();
						// Wait for the Bookmark mock to be called
						cy.waitForAppLoading('elearningLoading');
						cy.getByAutoId('SBCardRibbon')
							.eq(index)
							.should('have.class', 'ribbon__white');
					}
				});
			});
		});
	});

	describe('PBC-200: (UI) View - Lifecycle - Success Tips - Filter by Category', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
		});

		after(() => {
			// Close the View All modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		it('View All Success Tips modal shows all archetypes by default', () => {
			// Verify all cards are displayed by default
			cy.getByAutoId('SBCard').then(cards => {
				expect(cards.length).to.eq(successPathItems.length);
			});
		});

		successPathArchetypes.forEach(archetype => {
			it(`View All Success Tips modal (card view) can filter by archetype: ${archetype}`, () => {
				// Filter by archetype, verify the count
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = successPathItems.filter(item => (item.archetype === archetype));
					cy.getByAutoId('SBCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});
		});

		it('View All Success Tips modal (card view) can filter by archetype: Not selected', () => {
			// Filter by archetype, verify the count. Note: 'Not selected' should show all items
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('SBCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});

		it('View All Success Tips modal filter should be searchable', () => {
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

		// TODO: The clear icon has been removed from the filter dropdowns...
		it.skip('View All Success Tips modal filter should be clearable', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Getting Started"]').click();

				cy.getByAutoId('SBCard').then(cards => {
					const filteredItems = successPathItems.filter(item => (item.archetype === 'Getting Started'));
					expect(cards.length).to.eq(filteredItems.length);
				});

				// Click the clear filter button, should show all items again
				cy.getByAutoId('category-filter').within(() => {
					cy.get('span[class="icon-close"]').click();
				});

				cy.getByAutoId('SBCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});
	});

	describe('PBC-354: Verify View All filter stickiness', () => {
		beforeEach(() => {
			// Open the View All modal and wait for cards to load
			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');
			cy.getByAutoId('SBCard').should('exist');
		});

		afterEach(() => {
			// Close the View All modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('View All Success Tips filter should be sticky', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click({ force: true });
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter is still in place
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('SBCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All Success Tips filter should NOT be sticky across use case changes', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click({ force: true });
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, change use cases, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Not selected');
			cy.getByAutoId('SBCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('View All Success Tips filter should NOT be sticky across page navigation', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click({ force: true });
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Not selected');
			cy.getByAutoId('SBCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('View All Success Tips filter should NOT be sticky across page reload', () => {
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click({ force: true });
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('ViewAllCloseModal').click();
			cy.getByAutoId('ViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessTips_').click();
			cy.getByAutoId('ViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Not selected');
			cy.getByAutoId('SBCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('PBC-198: View All Success Tips filter should be sticky across table/card view', () => {
			// Apply the filter
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click({ force: true });
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Switch to table view, verify the filter is still in place
			cy.getByAutoId('sb-table-view-btn').click({ force: true });
			const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
			cy.getByAutoId('ViewAllTable')
				.within(() => {
					cy.get('tr').then(rows => {
						// Note that the first tr is the column headers
						expect(rows.length - 1).to.eq(filteredItems.length);
					});
				});

			// Switch back to card view, verify the filter is still in place
			cy.getByAutoId('sb-card-view-btn').click({ force: true });
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				cy.getByAutoId('SBCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});
	});

	describe('PBC-441: (UI View): Solution Racetrack  - Certification Prep Hover', () => {
		visibleCertificationsItems.forEach((certificationItem, index) => {
			it(`Should have hover modal on Certifications links: ${certificationItem.title}`, () => {
				// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
				// that the hover modal and it's elements exist in the DOM. See below for reference:
				// https://docs.cypress.io/api/commands/hover.html#Workarounds
				// https://github.com/cypress-io/cypress/issues/10
				cy.getByAutoId('_Certifications_-Item')
					.eq(index)
					.should('contain', certificationItem.title)
					.parent()
					.parent()
					.within(() => {
						cy.getByAutoId('recommendedElearning-HoverModal-Title')
							.should('contain', certificationItem.title)
							.and('have.class', 'title-line-clamp');
						cy.getByAutoId('recommendedElearning-HoverModal-Description')
							.should('contain', certificationItem.description)
							// PBC-611 Truncate description text
							// Since this handled by the styles, just validate the class exists
							.and('have.class', 'line-clamp');
						cy.getByAutoId('recommendedElearning-HoverModal-Rating').should('have.attr', 'ng-reflect-rating', parseFloat(certificationItem.rating).toString());
						// Duration/clock are only displayed if duration is set
						if (certificationItem.duration) {
							cy.getByAutoId('recommendedElearning-HoverModal-DurationClock').should('exist');
							cy.getByAutoId('recommendedElearning-HoverModal-Duration').should('contain', certificationItem.duration);
						} else {
							cy.getByAutoId('recommendedElearning-HoverModal-DurationClock').should('not.exist');
						}
					});
			});
		});
	});

	describe('PBC-459: (UI) View - Lifecycle - All Product Documentation and Videos', () => {
		it('Success Tips section should include link to all docs', () => {
			cy.getByAutoId('Success Tips Panel').within(() => {
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').should('be.visible');
			});
			cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
			cy.getByAutoId('ViewAllModal').within(() => {
				cy.getByAutoId('ViewAllModal-Title').should('have.text', i18n._ProductGuides_);
				cy.getByAutoId('ViewAllCloseModal').click();
			});
			cy.getByAutoId('ViewAllModal').should('not.exist');
		});

		describe('Card View', () => {
			before(() => {
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Ensure we're in card view
				cy.getByAutoId('pg-card-view-btn').click();
			});

			after(() => {
				// Refresh the data to reset any bookmark changes
				cy.loadApp();
				cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
			});

			it('All product guides modal card view should contain all items', () => {
				// Just check the first 10 items for speed
				const items = Cypress._.slice(Cypress._.cloneDeep(allProductGuidesItems), 0, 10);
				items.forEach((item, index) => {
					cy.getByAutoId('PGCard').eq(index).within(() => {
						cy.getByAutoId('PGCardArchetype').should('have.text', item.archetype);
						// PBC-567 Title and Launch button should have link to new tab
						cy.getByAutoId('successtitle')
							.should('have.text', item.title)
							.and('have.attr', 'href', item.url)
							.and('have.attr', 'target', '_blank');
						cy.getByAutoId('PGCardTitle')
							.should('have.class', 'title-line-clamp');
						cy.getByAutoId('PGCardDescription')
							.should('have.text', item.description)
							.and('have.class', 'desc-line-clamp');
						cy.getByAutoId('LaunchButton')
							.should('exist')
							.and('have.text', i18n._View_)
							.parent()
							.should('have.attr', 'href', item.url)
							.and('have.attr', 'target', '_blank');
						// Handle duration text and clock icon
						cy.getByAutoId('PGCardDuration').should('contain', item.duration);
						cy.getByAutoId('PGCardDuration')
							.get('.icon-clock')
							.should('exist');
						// Handle content type
						switch (item.type) {
							case 'Video':
								cy.get('.icon-video')
									.should('exist');
								break;
							case 'Web Page':
								cy.get('.icon-link')
									.should('exist');
								break;
							case 'PDF':
								cy.get('.icon-file-pdf-o')
									.should('exist');
								break;
							case 'Data Sheet':
								// Data Sheet should have document icon
								cy.get('.icon-file-o')
									.should('exist');
								break;
							default:
								Cypress.log({
									name: 'LOG',
									message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
								});
								cy.get('.icon-link')
									.should('exist');
						}
						// Handle bookmark ribbon
						if (item.bookmark) {
							cy.getByAutoId('PGCardRibbon').should('have.class', 'ribbon__blue');
						} else {
							cy.getByAutoId('PGCardRibbon').should('have.class', 'ribbon__white');
						}
					});
				});
			});

			describe('Bookmark items', () => {
				before(() => {
					// Switch to mock data with no items bookmarked
					successPathMock.enable('Product Guides IBN - Campus Network Assurance - twoUnbookmarked');

					// Close the View All modal
					cy.getByAutoId('ViewAllCloseModal').click();
					cy.getByAutoId('ViewAllModal').should('not.exist');

					// Re-open the Product Guides View All modal, and ensure we're in card view
					cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
					cy.wait('Product Guides IBN - Campus Network Assurance - twoUnbookmarked');
					cy.getByAutoId('pg-card-view-btn').click();
				});

				after(() => {
					// Switch back to the default mock
					successPathMock.enable('Product Guides IBN - Campus Network Assurance');

					// Refresh the page to force-reset bookmarks
					cy.window().then(win => {
						win.sessionStorage.clear(); // reset back to default card view
					});
					cy.loadApp();
					cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
				});

				it('All product guides modal card view can bookmark items', () => {
					// Bookmark
					cy.getByAutoId('PGCard').each($card => {
						cy.wrap($card)
							.within(() => {
								cy.getByAutoId('PGCardRibbon')
									.should('have.class', 'ribbon__white')
									.click();
								cy.waitForAppLoading('elearningLoading');
								cy.getByAutoId('PGCardRibbon')
									.should('have.class', 'ribbon__blue');
							});
					});

					// Unbookmark
					cy.getByAutoId('PGCard').each($card => {
						cy.wrap($card)
							.within(() => {
								cy.getByAutoId('PGCardRibbon')
									.should('have.class', 'ribbon__blue')
									.click();
								cy.waitForAppLoading('elearningLoading');
								cy.getByAutoId('PGCardRibbon')
									.should('have.class', 'ribbon__white');
							});
					});
				});
			});
		});

		describe('Table View', () => {
			before(() => {
				// Open the modal and switch to table view
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.waitForAppLoading('productGuidesLoading');
				cy.getByAutoId('pg-table-view-btn').click();
			});

			after(() => {
				// Refresh the page to force-reset bookmarks
				cy.window().then(win => {
					win.sessionStorage.clear(); // reset back to default card view
				});
				cy.loadApp();
				cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
			});

			it('All product guides modal table view should have expected columns', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.get('th').then($columnHeaders => {
							// Should be 4 column headers (Bookmark, Name, Category, Format)
							expect($columnHeaders.length).to.eq(5);
						});
						cy.getByAutoId('ViewAllTable-columnHeader-Bookmark').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Name').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Category').should('exist');
						cy.getByAutoId('ViewAllTable-columnHeader-Format').should('exist');
					});
			});

			it('All product guides modal table view should contain all items', () => {
				// Just check the first 10 items for speed
				const items = Cypress._.slice(Cypress._.cloneDeep(allProductGuidesItems), 0, 10);
				items.forEach((item, index) => {
					cy.getByAutoId('ViewAllTable').within(() => {
						// Increase index by 1, since the first tr has the column headers
						cy.get('tr').eq(index + 1).within(() => {
							// PBC-567 Title and Launch button should have link to new tab
							cy.getByAutoId('PG-Name-rowValue')
								.should('have.text', item.title)
								.and('have.attr', 'href', item.url)
								.and('have.attr', 'target', '_blank');
							cy.getByAutoId('LaunchButton')
								.should('exist')
								.and('have.text', i18n._View_)
								.parent()
								.should('have.attr', 'href', item.url)
								.and('have.attr', 'target', '_blank');
							cy.getByAutoId('ViewAllTable-Category-rowValue').should('have.text', item.archetype);
							// Handle duration text and clock icon
							cy.getByAutoId('ViewAllTable-Format-rowValue-duration').should('contain', item.duration);
							cy.getByAutoId('ViewAllTable-Format-rowValue-clock').should('exist');
							// Handle content type
							switch (item.type) {
								case 'Video':
									cy.get('.icon-video')
										.should('exist');
									break;
								case 'Web Page':
									cy.get('.icon-link')
										.should('exist');
									break;
								case 'PDF':
									cy.get('.icon-file-pdf-o')
										.should('exist');
									break;
								case 'Data Sheet':
									// Data Sheet should have document icon
									cy.get('.icon-file-o')
										.should('exist');
									break;
								default:
									Cypress.log({
										name: 'LOG',
										message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
									});
									cy.get('span').should('have.class', 'icon-link');
							}
							// Handle bookmark ribbon
							if (item.bookmark) {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--on');
							} else {
								cy.getByAutoId('SBListRibbon').should('have.class', 'icon-bookmark--off');
							}
						});
					});
				});
			});

			// TODO: Sorting needs a whole new set of mocks, since the sort is now an API param...
			// Could also just remove these, as the API *should* have their own tests for sort order...
			it.skip('All product guides modal table view should be sortable by Name', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
						const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});

						// Reverse the sort and re-verify order
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
						const sortedItemsDesc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			// TODO: Sorting needs a whole new set of mocks, since the sort is now an API param...
			// Could also just remove these, as the API *should* have their own tests for sort order...
			it.skip('All product guides modal table view should be sortable by Category', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Category').click({ force: true });
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
						cy.getByAutoId('ViewAllTable-columnHeader-Category').click({ force: true });
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

			// TODO: Sorting needs a whole new set of mocks, since the sort is now an API param...
			// Could also just remove these, as the API *should* have their own tests for sort order...
			it.skip('All product guides modal table view should be sortable by Format', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Format').click({ force: true });
						const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['type'], ['asc']);
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								switch (item.type) {
									case 'Video':
										// Video should have play icon
										cy.get('span').should('have.class', 'icon-video');
										break;
									case 'Web Page':
										// Web Page should have grid icon
										cy.get('span').should('have.class', 'icon-link');
										break;
									case 'PDF':
										// PDF should have PDF icon
										cy.get('span').should('have.class', 'icon-file-pdf-o');
										break;
									case 'Data Sheet':
										// Data Sheet should have document icon
										cy.get('span').should('have.class', 'icon-file-o');
										break;
									default:
										Cypress.log({
											name: 'LOG',
											message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
										});
										cy.get('span').should('have.class', 'icon-link');
								}
							});
						});

						// Reverse the sort and re-verify order
						cy.getByAutoId('ViewAllTable-columnHeader-Format').click({ force: true });
						const sortedItemsDesc = Cypress._.orderBy(allProductGuidesItems, ['type'], ['desc']);
						sortedItemsDesc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								switch (item.type) {
									case 'Video':
										// Video should have play icon
										cy.get('span').should('have.class', 'icon-video');
										break;
									case 'Web Page':
										// Web Page should have grid icon
										cy.get('span').should('have.class', 'icon-link');
										break;
									case 'PDF':
										// PDF should have PDF icon
										cy.get('span').should('have.class', 'icon-file-pdf-o');
										break;
									case 'Data Sheet':
										// Data Sheet should have document icon
										cy.get('span').should('have.class', 'icon-file-o');
										break;
									default:
										Cypress.log({
											name: 'LOG',
											message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${item.type} ! TREATING AS WEB PAGE...`,
										});
										cy.get('span').should('have.class', 'icon-link');
								}
							});
						});
					});
			});

			// TODO: Filtering needs a whole new set of mocks, since the filter is now an API param...
			// Could also just remove these, as the API *should* have their own tests for filtering...
			allProductGuidesArchetypes.forEach(archetype => {
				it.skip(`All product guides modal table view can filter by archetype: ${archetype}`, () => {
					// Filter uses cui-select w/ cui-vscroll-viewport, which doesn't immediately
					//  put all options into the DOM. Instead of clicking the option, just
					//  filter the list directly via the component's filter handler.
					const filterList = archStr => {
						cy.window().then(win => {
							win.activeComponents.LifecycleComponent.selectedFilterForPG = archStr;
							win.activeComponents.LifecycleComponent.selectFilter('PG');
							cy.get('html').click(); // force angular change detection
							cy.waitForAppLoading('productGuidesLoading');
						});
					};
					// Filter by archetype, verify the count
					filterList(archetype);

					const filteredItems = allProductGuidesItems.filter(
						item => (item.archetype === archetype)
					);
					cy.getByAutoId('ViewAllTable')
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
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(allProductGuidesItems.length);
						});
					});
			});

			describe('Bookmark items', () => {
				before(() => {
					// Switch to mock data with no items bookmarked
					successPathMock.enable('Product Guides IBN - Campus Network Assurance - twoUnbookmarked');

					// Close the View All modal
					cy.getByAutoId('ViewAllCloseModal').click();
					cy.getByAutoId('ViewAllModal').should('not.exist');

					// Re-open the Product Guides View All modal, and ensure we're in table view
					cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
					cy.wait('Product Guides IBN - Campus Network Assurance - twoUnbookmarked');
					cy.getByAutoId('pg-table-view-btn').click();
				});

				after(() => {
					// Switch back to the default mock
					successPathMock.enable('Product Guides IBN - Campus Network Assurance');

					// Refresh the page to force-reset bookmarks
					cy.window().then(win => {
						win.sessionStorage.clear(); // reset back to default card view
					});
					cy.loadApp();
					cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
				});

				it('All product guides modal table view can bookmark items', () => {
					// Bookmark
					cy.get('tr.td-row').each($row => {
						cy.wrap($row)
							.within(() => {
								cy.getByAutoId('SBListRibbon')
									.should('have.class', 'icon-bookmark--off')
									.click();
								cy.waitForAppLoading('elearningLoading');
								cy.getByAutoId('SBListRibbon')
									.should('have.class', 'icon-bookmark--on');
							});
					});

					// Unbookmark
					cy.get('tr.td-row').each($row => {
						cy.wrap($row)
							.within(() => {
								cy.getByAutoId('SBListRibbon')
									.should('have.class', 'icon-bookmark--on')
									.click();
								cy.waitForAppLoading('elearningLoading');
								cy.getByAutoId('SBListRibbon')
									.should('have.class', 'icon-bookmark--off');
							});
					});
				});
			});
		});

		// TODO: These tests should be re-written to verify we call the APIs with the correct sort
		describe.skip('Sorting Stickiness', () => {
			beforeEach(() => {
				// Open the modal and switch to table view
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('pg-table-view-btn').click();
			});

			afterEach(() => {
				// Switch to back to card view and close the modal
				cy.getByAutoId('pg-card-view-btn').click();
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Make sure we're on the lifecycle page and the default use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Guides IBN - Campus Network Assurance');
			});

			it('All product guides modal table sort should be sticky across modal close/re-open', () => {
				const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['asc']);

				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					});

				// Close and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the still in table view and sort is still in place
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal sort should be sticky across table/card view', () => {
				const sortedItemsAsc = Cypress._.orderBy(allProductGuidesItems, ['title'], ['asc']);

				// Sort the data
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					});

				// Switch to card view, verify the sort is still in place
				cy.getByAutoId('pg-card-view-btn').click();
				cy.getByAutoId('ViewAllModal').within(() => {
					sortedItemsAsc.forEach((item, index) => {
						cy.getByAutoId('PGCardTitle')
							.eq(index)
							.should('have.text', item.title);
					});
				});

				// Switch back to table view, verify sort is still in place
				cy.getByAutoId('pg-table-view-btn').click();
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						sortedItemsAsc.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table sort should NOT be sticky across use case changes', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					});

				// Close the modal, switch use cases, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify still in table view and sort was reset to default
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						campusNetSegmentationGuides.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table sort should NOT be sticky across page navigation', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					});

				// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Guides IBN - Campus Network Assurance');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the sort was reset to default
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						allProductGuidesItems.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});

			it('All product guides modal table sort should NOT be sticky across page reload', () => {
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.getByAutoId('ViewAllTable-columnHeader-Name').click({ force: true });
					});

				// Close the modal, reload the page, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.loadApp();
				cy.wait('Product Guides IBN - Campus Network Assurance');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the sort was reset to default
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						allProductGuidesItems.forEach((item, index) => {
							// Note that our actual data rows start at tr 1, because 0 is the headers
							cy.get('tr').eq(index + 1).within(() => {
								// Only check the field we've sorted by, since the sorting of items that have the
								// same value depends on previous sorts
								cy.getByAutoId('PG-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});
		});

		// TODO: These tests should be re-written to verify we call the APIs with the correct filter
		describe.skip('Filter Stickiness', () => {
			beforeEach(() => {
				// Open the View All modal
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
			});

			afterEach(() => {
				// Close the View All modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Make sure we're on the lifecycle page and the default use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Guides IBN - Campus Network Assurance');
			});

			it('All product guides modal filter should be sticky across modal close/re-open', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click({ force: true });
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the filter is still in place
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
					const filteredItems = allProductGuidesItems.filter(item => (item.archetype === 'Project Planning'));
					cy.getByAutoId('PGCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});

			it('All product guides modal filter should NOT be sticky across use case changes', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click({ force: true });
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close the modal, change use cases, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
				cy.wait('Product Guides IBN - Campus Network Segmentation');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the filter was cleared and all items are displayed
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Not selected');
				cy.getByAutoId('PGCard').then($cards => {
					expect($cards.length).to.eq(campusNetSegmentationGuides.length);
				});
			});

			it('All product guides modal filter should NOT be sticky across page navigation', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click({ force: true });
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('Product Guides IBN - Campus Network Assurance');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the filter was cleared and all items are displayed
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Not selected');
				cy.getByAutoId('PGCard').then($cards => {
					expect($cards.length).to.eq(allProductGuidesItems.length);
				});
			});

			it('All product guides modal filter should NOT be sticky across page reload', () => {
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click({ force: true });
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Close the modal, reload the page, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.loadApp();
				cy.wait('Product Guides IBN - Campus Network Assurance');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify the filter was cleared and all items are displayed
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Not selected');
				cy.getByAutoId('PGCard').then($cards => {
					expect($cards.length).to.eq(allProductGuidesItems.length);
				});
			});

			it('All product guides modal filter should be sticky across table/card view', () => {
				// Apply the filter
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get('a[title="Project Planning"]').click({ force: true });
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				});

				// Switch to table view, verify the filter is still in place
				cy.getByAutoId('pg-table-view-btn').click();
				const filteredItems = allProductGuidesItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('ViewAllTable')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});
					});

				// Switch back to card view, verify the filter is still in place
				cy.getByAutoId('pg-card-view-btn').click();
				cy.getByAutoId('ViewAllModal').within(() => {
					cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
					cy.getByAutoId('PGCard').then(cards => {
						expect(cards.length).to.eq(filteredItems.length);
					});
				});
			});
		});

		describe('Table vs. Card View Stickiness', () => {
			beforeEach(() => {
				// Open the modal and ensure we're in card view
				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();
				cy.getByAutoId('pg-card-view-btn').click();
			});

			afterEach(() => {
				// Switch to back to card view and close the modal
				cy.getByAutoId('pg-card-view-btn').click();
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				// Make sure we're on the lifecycle page and the default use case
				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
			});

			it('All product guides modal table vs. card view should be sticky across modal close/re-open', () => {
				// Switch to table view
				cy.getByAutoId('pg-table-view-btn').click();

				// Close and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('exist');
			});

			it('All product guides modal table vs. card view should be sticky across usecase change', () => {
				// Switch to table view
				cy.getByAutoId('pg-table-view-btn').click();

				// Close the modal, switch use cases, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('UseCaseDropdown').click();
				cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('exist');
			});

			it('All product guides modal table vs. card view should be sticky across page navigation', () => {
				// Switch to table view
				cy.getByAutoId('pg-table-view-btn').click();

				// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.getByAutoId('Facet-Assets & Coverage').click();
				cy.getByAutoId('Facet-Lifecycle').click();
				cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('exist');
			});

			it('All product guides modal table vs. card view should be sticky across page reload', () => {
				// Switch to table view
				cy.getByAutoId('pg-table-view-btn').click();

				// Close the modal, reload the page, and re-open the modal
				cy.getByAutoId('ViewAllCloseModal').click();
				cy.getByAutoId('ViewAllModal').should('not.exist');

				cy.loadApp();
				cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

				cy.getByAutoId('ShowModalPanel-_ProductGuides_').click();

				// Verify we're still in table view
				cy.getByAutoId('ViewAllTable').should('exist');
			});
		});
	});

	describe('Success Tips: Hover-over to show more content about the module', () => {
		visibleSuccessPathItems.forEach((successItem, index) => {
			it(`Should have hover modal on Success Tips links: ${successItem.title}`, () => {
				// NOTE: Cypress can not trigger elements with :hover css property, so we'll just check
				// that the hover modal and it's elements exist in the DOM. See below for reference:
				// https://docs.cypress.io/api/commands/hover.html#Workarounds
				// https://github.com/cypress-io/cypress/issues/10
				cy.getByAutoId('successbytes-item')
					.eq(index)
					.should('contain', successItem.title)
					.within(() => {
						cy.getByAutoId('successbytes-HoverModal-Title')
							.should('contain', successItem.title)
							.and('have.class', 'title-line-clamp');
						cy.getByAutoId('successbytes-HoverModal-Description')
							.should('contain', successItem.description)
							// PBC-611 Truncate description text
							// Since this handled by the styles, just validate the class exists
							.and('have.class', 'sb-desc-line-clamp');
						// Duration/clock are only displayed if duration is set
						if (successItem.duration) {
							cy.getByAutoId('successbytes-HoverModal-DurationClock').should('exist');
							cy.getByAutoId('successbytes-HoverModal-Duration').should('contain', successItem.duration);
						} else {
							cy.getByAutoId('successbytes-HoverModal-DurationClock').should('not.exist');
						}
						// Handle bookmark
						if (successItem.bookmark) {
							cy.getByAutoId('successbytes-HoverModal-BookmarkRibbon')
								.should('exist')
								.and('have.class', 'ribbon__blue');
						} else {
							cy.getByAutoId('successbytes-HoverModal-BookmarkRibbon')
								.should('exist')
								.and('have.class', 'ribbon__white');
						}
						// Handle type
						switch (successItem.type) {
							case 'Web Page':
								cy.getByAutoId('SuccessBytesHoverBlock-WebIcon').should('exist');
								break;
							case 'Video':
								cy.getByAutoId('SuccessBytesHoverBlock-VideoIcon').should('exist');
								break;
							case 'PDF':
								cy.getByAutoId('SuccessBytesHoverBlock-PDFIcon').should('exist');
								break;
							case 'Data Sheet':
								cy.getByAutoId('SuccessBytesHoverBlock-DataSheetIcon').should('exist');
								break;
							default:
								Cypress.log({
									name: 'LOG',
									message: `UNRECOGNIZED Success Tips TYPE: ${successItem.type} ! TREATING AS WEB PAGE...`,
								});
								cy.getByAutoId('SuccessBytesHoverBlock-WebIcon').should('exist');
						}
					});
			});
		});
	});
});
