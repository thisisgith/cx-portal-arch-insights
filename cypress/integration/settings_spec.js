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
			cy.getByAutoId('settings.system.usage.label').should('have.text', i18n._ResourceUsage_.toUpperCase());

			cy.getByAutoId('settings.system.info').should('exist');
			cy.getByAutoId('settings.system.info.label').should('have.text', i18n._SystemInfo_.toUpperCase());

			cy.getByAutoId('settings.sidebar').should('exist');
			cy.getByAutoId('settings.sidebar').within(() => {
				cy.get('a').should('contain', i18n._System_);
			});
		});

		it('Renders Status Panel Content', () => {
			cy.getByAutoId('settings.system.status.panel').within(() => {
				cy.get('div').should('contain', i18n._CiscoCXCollector_);
				cy.get('div').should('contain', mainData.ie_version);
				cy.get('div').should('contain', mainData.ieStatus);
			});

			cy.getByAutoId('settings.system.app.panel').each(($el, index) => {
				cy.wrap($el).should('contain', mainData.component_details[index].name);
				cy.wrap($el).should('contain', mainData.component_details[index].version);
				cy.wrap($el).should('contain', mainData.component_details[index].status);

				if (mainData.component_details[index].status === 'Running') {
					cy.wrap($el).within(() => {
						cy.get("[ng-reflect-ng-class='text-success']").should('exist');
					});
				}

				if (mainData.component_details[index].status === 'Stopped') {
					cy.wrap($el).within(() => {
						// TODO: Verify the Restart Link (PBC-318)
						cy.get("[ng-reflect-ng-class='text-secondary']").should('exist');
					});
				}

				if (mainData.component_details[index].status.match(/^(CrashLoopBackOff|Error)$/)) {
					cy.wrap($el).within(() => {
						cy.getByAutoId('errorLink').should('exist');
						cy.getByAutoId('errorLink').should('have.text', i18n._ErrorDetails_);
						cy.getByAutoId('errorLink').click();
						cy.getByAutoId('errorLink').should('have.text', i18n._HideErrorDetails_);
						cy.get('div').should('contain', mainData.component_details[index].additional_details.error);
						cy.get("[ng-reflect-ng-class='text-danger']").should('exist');
					});
				}
			});
		});

		it('Renders Usage Panel Content', () => {
			const hw = mainData.system_details.hardware_details;

			cy.getByAutoId('settings.system.usage').within(() => {
				cy.getByAutoId(`usage-${i18n._CurrentCPUUtilization_}`).should('contain', i18n._CurrentCPUUtilization_.toUpperCase());
				cy.getByAutoId(`usage-${i18n._CurrentAvailableMemory_}`).should('contain', i18n._CurrentAvailableMemory_.toUpperCase());
				cy.getByAutoId(`usage-${i18n._FreeDiskSpace_}`).should('contain', i18n._FreeDiskSpace_.toUpperCase());
			});

			cy.getByAutoId(`usage-${i18n._CurrentCPUUtilization_}`).within(() => {
				cy.get('cui-gauge').should('exist');
				cy.get('cui-gauge').should('have.text', `${Cypress._.parseInt(hw.cpu_utilization, 10)}%`);
			});

			cy.getByAutoId(`usage-${i18n._CurrentAvailableMemory_}`).within(() => {
				cy.get('cui-gauge').should('exist');
				const expected = Math.ceil(
					(Cypress._.parseInt(hw.free_memory, 10) / Cypress._.parseInt(hw.total_memory, 10)) * 100
				);
				cy.get('cui-gauge').should('have.text', `${expected}%`);
			});

			cy.getByAutoId(`usage-${i18n._FreeDiskSpace_}`).within(() => {
				cy.get('cui-gauge').should('exist');
				const expected = Math.ceil(
					(Cypress._.parseInt(hw.free_hdd_size, 10) / Cypress._.parseInt(hw.hdd_size, 10)) * 100
				);
				cy.get('cui-gauge').should('have.text', `${expected}%`);
			});
		});

		it('Renders Info Panel Content', () => {
			const os = mainData.system_details.os_details;
			cy.getByAutoId('settings.system.info').within(() => {
				cy.getByAutoId(`info-${i18n._OSImage_}`).should('exist');
				cy.getByAutoId(`info-${i18n._KernelVersion_}`).should('exist');
				cy.getByAutoId(`info-${i18n._DockerRuntimeVersion_}`).should('exist');
				cy.getByAutoId(`info-${i18n._KubernetesVersion_}`).should('exist');
			});
			cy.getByAutoId(`info-${i18n._OSImage_}`).within(() => {
				cy.get('div').should('contain', i18n._OSImage_.toUpperCase());
				cy.get('div').should('contain', os.osImage);
			});
			cy.getByAutoId(`info-${i18n._KernelVersion_}`).within(() => {
				cy.get('div').should('contain', i18n._KernelVersion_.toUpperCase());
				cy.get('div').should('contain', os.kernelVersion);
			});
			cy.getByAutoId(`info-${i18n._DockerRuntimeVersion_}`).within(() => {
				cy.get('div').should('contain', i18n._DockerRuntimeVersion_.toUpperCase());
				cy.get('div').should('contain', os.containerRuntimeVersion);
			});
			cy.getByAutoId(`info-${i18n._KubernetesVersion_}`).within(() => {
				cy.get('div').should('contain', i18n._KubernetesVersion_.toUpperCase());
				cy.get('div').should('contain', os.kubeletVersion);
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
			cy.getByAutoId('settings.system.usage.label').should('have.text', i18n._ResourceUsage_.toUpperCase());

			cy.getByAutoId('settings.system.info').should('exist');
			cy.getByAutoId('settings.system.info.label').should('have.text', i18n._SystemInfo_.toUpperCase());
		});
	});
});
