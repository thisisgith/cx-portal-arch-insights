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
				cy.get('div').should('contain', i18n._CXCollector_);
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

				if (mainData.component_details[index].status === 'FakeStatus') {
					cy.wrap($el).within(() => {
						cy.get("[ng-reflect-ng-class='text-danger']").should('exist');
					});
				}

				if (mainData.component_details[index].status.match(/^(ContainerCreation|Pending|PodInitializing)$/)) {
					cy.wrap($el).within(() => {
						cy.get("[ng-reflect-ng-class='text-warning']").should('exist');
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
				cy.get('cui-gauge').should('have.attr', 'ng-reflect-color', 'success');
			});

			cy.getByAutoId(`usage-${i18n._CurrentAvailableMemory_}`).within(() => {
				cy.get('cui-gauge').should('exist');
				const expected = Math.ceil(
					(Cypress._.parseInt(hw.free_memory, 10) / Cypress._.parseInt(hw.total_memory, 10)) * 100
				);
				cy.get('cui-gauge').should('have.text', `${expected}%`);
				cy.get('cui-gauge').should('have.attr', 'ng-reflect-color', 'warning');
			});

			cy.getByAutoId(`usage-${i18n._FreeDiskSpace_}`).within(() => {
				cy.get('cui-gauge').should('exist');
				const expected = Math.ceil(
					(Cypress._.parseInt(hw.free_hdd_size, 10) / Cypress._.parseInt(hw.hdd_size, 10)) * 100
				);
				cy.get('cui-gauge').should('have.text', `${expected}%`);
				cy.get('cui-gauge').should('have.attr', 'ng-reflect-color', 'danger');
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

		it('No Error Panel for successful API', () => {
			cy.get("[role='alert']").should('not.exist');
		});
	});
	context('Health-Status - Failure', () => {
		before(() => {
			cy.login();
			cy.loadApp('/admin/settings');
			cy.waitForAppLoading();
			healthMock.enable('Health-Status - Failure');
			cy.loadApp('/admin/settings');
			cy.waitForAppLoading();
		});

		it('Renders Status Panel', () => {
			cy.getByAutoId('settings.sidebar').should('exist');
			cy.getByAutoId('settings.sidebar').within(() => {
				cy.get('a').should('contain', i18n._System_);
			});
			cy.contains('No Results Found').should('exist');
		});

		it('Error Panel for failed API', () => {
			cy.get("[role='alert']").should('be.visible');
			cy.get("[role='alert']").should('have.class', 'alert--danger');
			cy.get("[role='alert']").within(() => {
				cy.get('div').should('contain', '500');
			});
		});
	});
});

describe('Control Point (Setup Wizard)', () => { // PBC-190
	before(() => {
		cy.login();
	});

	/**
	* Sets the local storage and loads application
	* @param {string} value The json formatted string to populate in storage
	*/
	function loadWizard (value) {
		cy.window().then(win => {
			win.localStorage.setItem('cxportal.cisco.com::IE_SETUP_STATE', value);
		});
		cy.loadApp('/setup-ie');
		cy.waitForAppLoading();
		cy.contains('button', 'Continue').click();
	}

	/**
	* Verifies the off/on state of the icons on the setup wizard
	* @param {bool} a The 1st icon state.
	* @param {bool} b The 2nd icon state.
	* @param {bool} c The 3rd icon state.
	* @param {bool} d The 4th icon state.
	*/
	function verifySidebar (a, b, c, d) {
		cy.get('ie-setup-status-bar').within(() => {
			cy.get('.setup-step').should('have.length', 4);
		});
		cy.get(`[title="${i18n._PreRequisites_.toUpperCase()}"]`).within(() => {
			cy.get('.setup-step__icon').should('have.attr', 'src').and('include', a ? '-on.svg' : '-off.svg');
		});
		cy.get(`[title="${i18n._VirtualMachine_.toUpperCase()}"]`).within(() => {
			cy.get('.setup-step__icon').should('have.attr', 'src').and('include', b ? '-on.svg' : '-off.svg');
		});
		cy.get(`[title="${i18n._CiscoCXCollector_.toUpperCase()}"]`).within(() => {
			cy.get('.setup-step__icon').should('have.attr', 'src').and('include', c ? '-on.svg' : '-off.svg');
		});
		cy.get(`[title="${i18n._CiscoDNACollector_.toUpperCase()}"]`).within(() => {
			cy.get('.setup-step__icon').should('have.attr', 'src').and('include', d ? '-on.svg' : '-off.svg');
		});
	}

	context('Setup Wizard : compKey=0', () => {
		before(() => {
			cy.loadApp('/setup-ie');
			cy.waitForAppLoading();
		});

		it('Sidebar Panel', () => {
			verifySidebar(true, false, false, false);
		});

		it('Pre-Requisites Panel', () => {
			// The First Step Contents
			cy.contains(`STEP 1: ${i18n._Prerequisites_.toUpperCase()}`).should('exist');
			cy.contains(i18n._ConnectDevicesToCX_).should('exist');
			cy.contains(i18n._InstallCiscoIE_).should('exist');
			cy.contains(i18n._YoullNeedAnEnvironment_).should('exist');
			cy.contains(i18n._ConnectDevicesToCX_).should('exist');
			cy.contains(i18n._HasVMWare_).should('exist');
			cy.contains(i18n._HasAtLeastReqs_).should('exist');
			cy.contains(i18n._CanConnectTo_).should('exist');

			cy.contains(i18n._GetStarted_.toUpperCase()).click();
			cy.location('search').should('contain', 'compKey=1');
		});
	});

	context('Setup Wizard : compKey=1', () => {
		before(() => {
			loadWizard('{"compKey":1}');
		});

		it('Sidebar Panel', () => {
			verifySidebar(true, false, false, false);
		});

		it('Environment Panel', () => {
			cy.contains(`STEP 1: ${i18n._Prerequisites_.toUpperCase()}`).should('exist');
			cy.contains(i18n._MyEnvironment_).should('exist');
			cy.contains(i18n._ViewSetupInstructions_).should('exist');

			cy.contains('button', i18n._VMWareVSphereESXi_).click();
			cy.location('search').should('contain', 'compKey=2');
			cy.location('search').should('contain', 'ovaSelection=vsphere');
			cy.go('back');
			cy.waitForAppLoading();

			cy.contains('button', i18n._VMWareVCenter_).click();
			cy.location('search').should('contain', 'compKey=2');
			cy.location('search').should('contain', 'ovaSelection=vcenter');
			cy.go('back');
			cy.waitForAppLoading();

			cy.contains('button', i18n._OracleVirtualBox_).click();
			cy.location('search').should('contain', 'compKey=2');
			cy.location('search').should('contain', 'ovaSelection=vbox');
		});
	});

	context('Setup Wizard : compKey=2 ovaSelection=vsphere', () => {
		before(() => {
			loadWizard('{"ovaSelection":"vsphere","compKey":2}');
		});

		it('Sidebar Panel', () => {
			verifySidebar(true, false, false, false);
		});

		it('Download OVA Panel', () => {
			cy.contains(`STEP 1: ${i18n._Prerequisites_.toUpperCase()}`).should('exist');
			cy.contains(i18n._DownloadOVAImage_).should('exist');
			cy.contains('a', 'Cisco End User License Agreement').should('have.attr', 'href')
				.and('eq', 'http://www.cisco.com/c/en/us/products/end-user-license-agreement.html');

			cy.contains('button', i18n._DownloadImage_.toUpperCase()).should('have.attr', 'disabled');
			cy.getByAutoId('business-fn-civ').click({ force: true });

			cy.getByAutoId('setup.ova.eula1').should('have.attr', 'ng-reflect-model', 'false');
			cy.contains('button', i18n._DownloadImage_.toUpperCase()).should('have.attr', 'disabled');
			cy.getByAutoId('setup.ova.eula1').click({ force: true });
			cy.getByAutoId('setup.ova.eula1').should('have.attr', 'ng-reflect-model', 'true');

			cy.getByAutoId('setup.ova.eula2').should('have.attr', 'ng-reflect-model', 'false');
			cy.contains('button', i18n._DownloadImage_.toUpperCase()).should('have.attr', 'disabled');
			cy.getByAutoId('setup.ova.eula2').click({ force: true });
			cy.getByAutoId('setup.ova.eula2').should('have.attr', 'ng-reflect-model', 'true');

			cy.contains('button', i18n._DownloadImage_.toUpperCase()).should('not.have.attr', 'disabled');
		});
	});

	context('Setup Wizard : compKey=3 ovaSelection=vsphere', () => {
		before(() => {
			loadWizard('{"ovaSelection":"vsphere","compKey":3,"deployStepsSet":"ova:0"}');
		});

		it('Sidebar Panel', () => {
			verifySidebar(true, true, false, false);
		});

		it('Virtual Machine Panel', () => {
			cy.contains(`STEP 2: ${i18n._VirtualMachine_.toUpperCase()}`).should('exist');
			cy.contains(i18n._DeployOVA_).should('exist');

			cy.location('search').should('contain', 'deployStepsSet=ova:0');
			cy.contains(i18n._SetupInstruction_1A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=ova:1');
			cy.contains(i18n._SetupInstruction_2A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=ova:2');
			cy.contains(i18n._SetupInstruction_3A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=ova:3');
			cy.contains(i18n._SetupInstruction_4A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=ova:4');
			cy.contains(i18n._SetupInstruction_5A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=ova:5');
			cy.contains(i18n._SetupInstruction_6A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=ova:6');
			cy.contains(i18n._SetupInstruction_7A_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'compKey=4');
		});
	});

	context('Setup Wizard : compKey=3 ovaSelection=vcenter', () => {
		before(() => {
			loadWizard('{"ovaSelection":"vcenter","compKey":3,"deployStepsSet":"vcenter:0"}');
		});

		it('Sidebar Panel', () => {
			verifySidebar(true, true, false, false);
		});

		it('Virtual Machine Panel', () => {
			cy.contains(`STEP 2: ${i18n._VirtualMachine_.toUpperCase()}`).should('exist');
			cy.contains(i18n._DeployOVA_).should('exist');

			cy.location('search').should('contain', 'deployStepsSet=vcenter:0');
			cy.contains(i18n._SetupInstruction_1B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:1');
			cy.contains(i18n._SetupInstruction_2B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:2');
			cy.contains(i18n._SetupInstruction_3B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:3');
			cy.contains(i18n._SetupInstruction_4B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:4');
			cy.contains(i18n._SetupInstruction_5B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:5');
			cy.contains(i18n._SetupInstruction_6B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:6');
			cy.contains(i18n._SetupInstruction_7B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vcenter:7');
			cy.contains(i18n._SetupInstruction_8B_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'compKey=4');
		});
	});

	context('Setup Wizard : compKey=3 ovaSelection=vbox', () => {
		before(() => {
			loadWizard('{"ovaSelection":"vbox","compKey":3,"deployStepsSet":"vbox:0"}');
		});

		it('Sidebar Panel', () => {
			verifySidebar(true, true, false, false);
		});

		it('Virtual Machine Panel', () => {
			cy.contains(`STEP 2: ${i18n._VirtualMachine_.toUpperCase()}`).should('exist');
			cy.contains(i18n._DeployVBox_).should('exist');

			cy.location('search').should('contain', 'deployStepsSet=vbox:0');
			cy.contains(i18n._SetupInstruction_1C_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vbox:1');
			cy.contains(i18n._SetupInstruction_2C_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'deployStepsSet=vbox:2');
			cy.contains(i18n._SetupInstruction_3C_).should('exist');
			cy.contains(i18n._IveDoneThis_.toUpperCase()).click();

			cy.location('search').should('contain', 'compKey=4');
		});
	});
});
