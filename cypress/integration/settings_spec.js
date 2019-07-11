import MockService from '../support/mockService';

const healthMock = new MockService('HealthStatusScenarios'); // for future changes

const mainScenario = healthMock.getScenario('GET', 'Call to get health-status');
const mainData = mainScenario.response.body[0];

const i18n = require('../../src/assets/i18n/en-US.json');

describe('Control Point (Admin Settings)', () => { // PBC-207
	context('Call to get health-status', () => {
		before(() => {
			cy.login();
			cy.loadApp('/admin/settings');
			cy.waitForAppLoading();
			healthMock.enable('Call to get health-status');
		});

		it('Renders Page Layout', () => {
			cy.getByAutoId('settings.system.status').should('exist');

			cy.getByAutoId('settings.system.status.label').should('have.text', i18n._Status_.toUpperCase());
			cy.getByAutoId('settings.system.status.panel').should('exist');

			cy.getByAutoId('settings.system.app.label').should('have.text', i18n._Applications_.toUpperCase());
			cy.getByAutoId('settings.system.app.panel').should('exist');

			cy.getByAutoId('settings.system.usage').should('exist');
			cy.getByAutoId('settings.system.usage.label').should('have.text', i18n._MemoryUsage_.toUpperCase());

			cy.getByAutoId('settings.system.info').should('exist');
			cy.getByAutoId('settings.system.info.label').should('have.text', i18n._SystemInfo_.toUpperCase());
		});

		it('Renders Status Panel Content', () => {
			cy.getByAutoId('settings.system.status.panel').within(() => {
				cy.get('div').should('contain', i18n._CiscoCXCollectorConnectivityModule_);
				cy.get('div').should('contain', mainData.ie_version);
				cy.get('div').should('contain', mainData.ieStatus);
			});

			cy.getByAutoId('settings.system.app.panel').each(($el, index) => {
				cy.wrap($el).should('contain', mainData.component_details[index].name);
				cy.wrap($el).should('contain', mainData.component_details[index].version);
				cy.wrap($el).should('contain', mainData.component_details[index].status);

				if (mainData.component_details[index].status === 'CrashLoopBackOff') {
					cy.wrap($el).within(() => {
						cy.getByAutoId('errorLink').should('exist');
						cy.getByAutoId('errorLink').should('have.text', i18n._ErrorDetails_);
						cy.getByAutoId('errorLink').click();
						cy.getByAutoId('errorLink').should('have.text', i18n._HideErrorDetails_);
						cy.get('div').should('contain', mainData.component_details[index].additional_details.error);
					});
				}
			});
		});
	});
	context('Health-Status - Failure', () => {
		before(() => {
			cy.login();
			cy.loadApp('/admin/settings');
			cy.waitForAppLoading();
			healthMock.enable('Health-Status - Failure');
		});

		it('Renders Status Panel', () => {
			// TODO : Expecting page content to change when PBC-302 is resolved
			cy.getByAutoId('settings.system.status').should('exist');

			cy.getByAutoId('settings.system.status.label').should('have.text', i18n._Status_.toUpperCase());
			cy.getByAutoId('settings.system.status.panel').should('exist');

			cy.getByAutoId('settings.system.app.label').should('have.text', i18n._Applications_.toUpperCase());
			cy.getByAutoId('settings.system.app.panel').should('not.exist');

			cy.getByAutoId('settings.system.usage').should('exist');
			cy.getByAutoId('settings.system.usage.label').should('have.text', i18n._MemoryUsage_.toUpperCase());

			cy.getByAutoId('settings.system.info').should('exist');
			cy.getByAutoId('settings.system.info.label').should('have.text', i18n._SystemInfo_.toUpperCase());
		});
	});
});
