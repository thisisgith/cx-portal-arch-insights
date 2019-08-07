import MockService from '../support/mockService';

const elearningMock = new MockService('ELearningScenarios');
const elearningOnboardScenario = elearningMock.getScenario('GET', '(E-Learning) IBN-Campus Network Assurance-Onboard');
const elearningItems = elearningOnboardScenario.response.body.items;

const successPathMock = new MockService('SuccessPathScenarios');
const successPathOnboardScenario = successPathMock.getScenario('GET', '(SP) IBN-Campus Network Assurance-Onboard');
const successPathItems = successPathOnboardScenario.response.body.items;

// Strip out all possible archetypes
const successPathArchetypes = Cypress._.chain(successPathItems)
	.map('archetype')
	.uniq()
	.value();

// Split up the eLearning response by type
const allELearningItems = [];
const allCertificationsItems = [];
const allRemoteItems = [];
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
			allRemoteItems.push(scenario);
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
const visibleRemoteItems = allRemoteItems.slice(0, 3);
const invisibleRemoteItems = allRemoteItems.slice(3);
const visibleSuccessPathItems = successPathItems.slice(0, 3);
const invisibleSuccessPathItems = successPathItems.slice(3);

describe('Learn Panel', () => {
	before(() => {
		cy.login();
		cy.loadApp();
		cy.waitForAppLoading();

		// Wait for both E-Learning and Success Paths to finish loading
		cy.waitForAppLoading('elearningLoading', 15000);
		cy.waitForAppLoading('successPathsLoading', 15000);
	});

	describe('PBC-125 Learning Content', () => {
		it('Learning panel should be displayed', () => {
			cy.getByAutoId('Learn Panel').should('contain', 'Learn');
		});

		it('Learning card sections only show when there is data in them', () => {
			let elearningFound = false;
			let certificationsFound = false;
			let trainingFound = false;
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
						trainingFound = true;
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
			if (trainingFound) {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock').should('exist');
			} else {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock').should('not.exist');
			}

			if (successPathItems.length > 0) {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock').should('exist')
					.and('contain', 'Success Bytes')
					.and('contain', 'Resources to fine-tune your tech');
			} else {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock').should('not.exist');
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
			visibleRemoteItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock')
					.should('contain', scenario.title);
			});
			invisibleRemoteItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-RemoteLearningLabsBlock')
					.should('not.contain', scenario.title);
			});
			visibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock')
					.should('contain', scenario.title);
			});
			invisibleSuccessPathItems.forEach(scenario => {
				cy.getByAutoId('LearnPanel-SuccessPathsBlock')
					.should('not.contain', scenario.title);
			});
		});
	});

	describe('PBC-15: (UI) View - Lifecycle - Success Bytes - View All Card View', () => {
		it('PBC-142/PBC-143: View All Success Bytes link should open modal with all results', () => {
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist')
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');
		});

		it('PBC-142/PBC-143: View All Success Bytes modal includes content type icons', () => {
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');
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
					default:
						Cypress.log({
							name: 'LOG',
							message: `UNRECOGNIZED SUCCESS PATH CONTENT TYPE: ${scenario.type}`,
						});
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
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');
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
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Cypress does not and will never support multiple tabs, so just check the link element
			// Reference: https://docs.cypress.io/guides/references/trade-offs.html#Multiple-tabs
			successPathItems.forEach(scenario => {
				cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
					cy.get(`a[href="${scenario.url}"]`)
						// Note that type: 'Web Page' gets displayed as 'Web'
						.should('contain', (scenario.type === 'Web Page' ? 'Web' : scenario.type))
						// target: _blank indicates we'll open in a new tab
						.and('have.attr', 'target', '_blank');
				});
			});

			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');
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
			cy.getByAutoId('_ELearning_-ViewAll').should('have.attr', 'href', 'https://pilot-digital-learning.cisco.com/cx#/')
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
				cy.get(`a[href="${elearningItem.url}"]`).parent()
					.should('contain', elearningItem.title)
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
			cy.getByAutoId('SuccessPathsViewAllModal').should('be.visible');

			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
		});

		after(() => {
			// Switch back to card view
			cy.getByAutoId('card-view-btn').click();

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.be.visible');

			// Reload the page to force-clear any sort/filter
			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('Success Bytes View All should be able to toggle between table and card views', () => {
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('SuccessCard').should('be.visible');
			cy.getByAutoId('SuccessPathsTable').should('not.be.visible');

			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('SuccessCard').should('not.be.visible');
			cy.getByAutoId('SuccessPathsTable').should('be.visible');
		});

		it('Success Bytes View All table should have expected columns', () => {
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					cy.get('th').then($columnHeaders => {
						// Should be 4 columns (Name, Category, Format, Bookmark)
						expect($columnHeaders.length).to.eq(4);
					});
					cy.getByAutoId('successBytesTable-columnHeader-Name').should('exist');
					cy.getByAutoId('successBytesTable-columnHeader-Category').should('exist');
					cy.getByAutoId('successBytesTable-columnHeader-Format').should('exist');
					cy.getByAutoId('successBytesTable-columnHeader-Bookmark').should('exist');
				});
		});

		it('Success Bytes View All table should not sort by default', () => {
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
							cy.getByAutoId('SuccessPathsTable-Category-rowValue').should('have.text', item.archetype);
							cy.getByAutoId('SuccessPathsTable-Format-rowValue-link')
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
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['title'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table should be sortable by Category', () => {
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Category').click();
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['archetype'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Category-rowValue').should('have.text', item.archetype);
						});
					});

					// Reverse the sort and re-verify order
					cy.getByAutoId('successBytesTable-columnHeader-Category').click();
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['archetype'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Category-rowValue').should('have.text', item.archetype);
						});
					});
				});
		});

		it('Success Bytes View All table should be sortable by Format', () => {
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Format').click();
					const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['type'], ['asc']);
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Format-rowValue-link')
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
					cy.getByAutoId('successBytesTable-columnHeader-Format').click();
					const sortedItemsDesc = Cypress._.orderBy(successPathItems, ['type'], ['desc']);
					sortedItemsDesc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Format-rowValue-link')
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
				cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
					cy.getByAutoId('cui-select').click();
					cy.get(`a[title="${archetype}"]`).click();

					const filteredItems = successPathItems.filter(item => (item.archetype === archetype));
					cy.getByAutoId('SuccessPathsTable')
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
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('SuccessPathsTable')
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
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();

				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('SuccessPathsTable')
					.should('be.visible')
					.within(() => {
						cy.get('tr').then(rows => {
							// Note that the first tr is the column headers
							expect(rows.length - 1).to.eq(filteredItems.length);
						});

						// Sort by name, verify the filter is still in place, and verify we sort within the
						// existing filter
						cy.getByAutoId('successBytesTable-columnHeader-Name').click();

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
								cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
							});
						});

						// Reverse the sort and re-verify filter and order
						cy.getByAutoId('successBytesTable-columnHeader-Name').click();

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
								cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
							});
						});
					});
			});
		});
	});

	describe('PBC-198: Success Bytes View All table sorting stickiness', () => {
		beforeEach(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Switch to table view
			cy.getByAutoId('table-view-btn').click();
		});

		afterEach(() => {
			// Switch back to card view
			cy.getByAutoId('card-view-btn').click();

			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('Success Bytes View All table sort should be sticky across modal close/re-open', () => {
			const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);

			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
				});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify the still in table view and sort is still in place
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should be sticky across table/card view', () => {
			const sortedItemsAsc = Cypress._.orderBy(successPathItems, ['title'], ['asc']);

			// Sort the data
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
				});

			// Switch to card view, verify the sort is still in place
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				sortedItemsAsc.forEach((item, index) => {
					cy.getByAutoId('SuccessCard')
						.eq(index)
						.should('contain', item.title);
				});
			});

			// Switch back to table view, verify sort is still in place
			cy.getByAutoId('table-view-btn').click();
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					sortedItemsAsc.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should NOT be sticky across use case changes', () => {
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
				});

			// Close the modal, switch use cases, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify still in table view and sort was reset to default
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should NOT be sticky across page navigation', () => {
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
				});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify we were reverted to card view (not sticky), and switch to table view
			cy.getByAutoId('SuccessPathsTable').should('not.be.visible');
			cy.getByAutoId('SuccessCard').should('be.visible');
			cy.getByAutoId('table-view-btn').click();

			// Verify the sort was reset to default
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});

		it('Success Bytes View All table sort should NOT be sticky across page reload', () => {
			cy.getByAutoId('SuccessPathsTable')
				.within(() => {
					cy.getByAutoId('successBytesTable-columnHeader-Name').click();
				});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify we were reverted to card view (not sticky), and switch to table view
			cy.getByAutoId('SuccessPathsTable').should('not.be.visible');
			cy.getByAutoId('SuccessCard').should('be.visible');
			cy.getByAutoId('table-view-btn').click();

			// Verify the sort was reset to default
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					successPathItems.forEach((item, index) => {
						// Note that our actual data rows start at tr 1, because 0 is the headers
						cy.get('tr').eq(index + 1).within(() => {
							// Only check the field we've sorted by, since the sorting of items that have the
							// same value depends on previous sorts
							cy.getByAutoId('SuccessPathsTable-Name-rowValue').should('have.text', item.title);
						});
					});
				});
		});
	});

	describe('PBC-200: (UI) View - Lifecycle - Success Bytes - Filter by Category', () => {
		before(() => {
			// Open the View All modal
			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');
		});

		after(() => {
			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');
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
				cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
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
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Not selected"]').click();

				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(successPathItems.length);
				});
			});
		});

		it('View All Success Bytes modal filter should be searchable', () => {
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
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
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
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
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');
		});

		afterEach(() => {
			// Close the View All modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			// Make sure we're on the lifecycle page and the default use case
			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Assurance').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');
		});

		it('View All Success Bytes filter should be sticky', () => {
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify the filter is still in place
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});

		it('View All Success Bytes filter should NOT be sitcky across use case changes', () => {
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, change use cases, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.getByAutoId('UseCaseDropdown').click();
			cy.getByAutoId('TechnologyDropdown-Campus Network Segmentation').click();
			cy.wait('(SP) IBN-Campus Network Segmentation-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.getByAutoId('SuccessCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('View All Success Bytes filter should NOT be sitcky across page navigation', () => {
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, change to Assets & Coverage, back to Lifecycle, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.getByAutoId('Facet-Assets & Coverage').click();
			cy.getByAutoId('Facet-Lifecycle').click();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.getByAutoId('SuccessCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('View All Success Bytes filter should NOT be sitcky across page reload', () => {
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Close the modal, reload the page, and re-open the modal
			cy.getByAutoId('SuccessPathCloseModal').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('not.exist');

			cy.loadApp();
			cy.wait('(SP) IBN-Campus Network Assurance-Onboard');

			cy.getByAutoId('ShowModalPanel-_SuccessBytes_').click();
			cy.getByAutoId('SuccessPathsViewAllModal').should('exist');

			// Verify the filter was cleared and all items are displayed
			cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', '');
			cy.getByAutoId('SuccessCard').then($cards => {
				expect($cards.length).to.eq(successPathItems.length);
			});
		});

		it('PBC-198: View All Success Bytes filter should be sticky across table/card view', () => {
			// Apply the filter
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').click();
				cy.get('a[title="Project Planning"]').click();
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
			});

			// Switch to table view, verify the filter is still in place
			cy.getByAutoId('table-view-btn').click();
			const filteredItems = successPathItems.filter(item => (item.archetype === 'Project Planning'));
			cy.getByAutoId('SuccessPathsTable')
				.should('be.visible')
				.within(() => {
					cy.get('tr').then(rows => {
						// Note that the first tr is the column headers
						expect(rows.length - 1).to.eq(filteredItems.length);
					});
				});

			// Switch back to card view, verify the filter is still in place
			cy.getByAutoId('card-view-btn').click();
			cy.getByAutoId('SuccessPathsViewAllModal').within(() => {
				cy.getByAutoId('cui-select').should('have.attr', 'ng-reflect-model', 'Project Planning');
				cy.getByAutoId('SuccessCard').then(cards => {
					expect(cards.length).to.eq(filteredItems.length);
				});
			});
		});
	});
});
