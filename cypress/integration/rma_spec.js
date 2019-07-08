import MockService from '../support/mockService';

describe('RMA Spec', () => {
	context('RMA Search', () => {
		before(() => {
			cy.login();
			cy.loadApp();
			cy.waitForAppLoading();
		});

		it('RMA 800000000 one replacement parts', () => {
			// RMA with 1 replacement part PBC-171
			// mock set at "RMA with one replacement part"
			const rmaVal = '800000000';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-rma-search').should('contain', 'RMA: '.concat(rmaVal));
			// TODO - uncomment once PBC-298 is resolved
			// cy.get('app-rma-search table th').eq(0).should('have.text', 'Status');
			cy.get('app-rma-search table th').eq(1).should('have.text', 'Case Number');
			cy.get('app-rma-search table th').eq(2).should('have.text', 'Carrier Tracking Number');
			cy.get('app-rma-search table th').eq(3).should('have.text', 'Contract Number');
			// Confirm replacement product contains one product string
			cy.get('app-rma-search table').within(() => {
				cy.get('th').eq(4).should('have.text', 'Replacement Product');
				cy.get('td').should('contain', '^Cisco ASR 920-12SZ-IM Router 0');
			});
			cy.get('app-rma-search table th').eq(5).should('have.text', 'Replacement Product ID');
			// TODO  uncommend the following to test the click
			cy.getByAutoId('RMAViewDetailsButton').should('exist').click();
			cy.get('h6').should('contain', 'Related to this Product');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it('RMA 800000000 four replacement parts', () => {
			// RMA with 4 replacement part PBC-171
			// mock set at "RMA with four replacement parts"
			cy.window().then(win => {
				// cy.log(win.mockService.getEnabledScenarios());
				win.mockService.enable('RMA with four replacement parts'); // enable the desired
				cy.getByAutoId('Facet-Assets & Coverage').should('exist').click(); // refresh after making a mock change
			});
			// cy.log("one");
			const rmaVal = '800000000';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-rma-search').should('contain', 'RMA: '.concat(rmaVal));
			// TODO - uncomment once PBC-298 is resolved
			// cy.get('app-rma-search table th').eq(0).should('have.text', 'Status');
			cy.get('app-rma-search table th').eq(1).should('have.text', 'Case Number');
			cy.get('app-rma-search table th').eq(2).should('have.text', 'Carrier Tracking Number');
			cy.get('app-rma-search table th').eq(3).should('have.text', 'Contract Number');
			// Confirm replacement product contains four product string
			cy.get('app-rma-search table').within(() => {
				cy.get('th').eq(4).should('have.text', 'Replacement Product');
				cy.get('td').should('contain', '^Cisco ASR 920-12SZ-IM Router 0');
				cy.get('td').should('contain', '^Cisco ASR 920-12SZ-IM Router 1');
				cy.get('td').should('contain', '^Cisco ASR 920-12SZ-IM Router 2');
				cy.get('td').should('contain', '^Cisco ASR 920-12SZ-IM Router 3');
			});
			// TODO  uncommend the following to test the click
			cy.getByAutoId('RMAViewDetailsButton').should('exist').click();
			cy.get('h6').should('contain', 'Related to this Product');
			cy.getByAutoId('searchClose').should('exist').click();
		});

		it('RMA 800000000 no replacement parts', () => {
			// RMA with no replacement part PBC-171
			// mock set at "RMA with no replacement parts"
			cy.window().then(win => {
				// cy.log(win.mockService.getEnabledScenarios());
				win.mockService.enable('RMA with no replacement parts'); // enable the desired
				cy.getByAutoId('Facet-Assets & Coverage').should('exist').click(); // refresh after making a mock change
			});

			const rmaVal = '800000000';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(rmaVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-rma-search').should('contain', 'RMA: '.concat(rmaVal));
			// TODO - uncomment once PBC-298 is resolved
			// cy.get('app-rma-search table th').eq(0).should('have.text', 'Status');
			cy.get('app-rma-search table th').eq(1).should('have.text', 'Case Number');
			cy.get('app-rma-search table th').eq(2).should('have.text', 'Carrier Tracking Number');
			cy.get('app-rma-search table th').eq(3).should('have.text', 'Contract Number');
			// Confirm replacement product contains N/A product string
			cy.get('app-rma-search table').within(() => {
				cy.get('th').eq(4).should('have.text', 'Replacement Product');
				cy.get('td span').should('contain', 'Unavailable');
			});
			cy.get('app-rma-search table th').eq(5).should('have.text', 'Replacement Product ID');
			// TODO  uncommend the following to test the click
			cy.getByAutoId('RMAViewDetailsButton').should('exist').click();
			cy.get('h6').should('contain', 'Related to this Product');
			cy.getByAutoId('searchClose').should('exist').click();
		});
		it('RMA 800000009', () => {
			const inputVal = '800000009';
			cy.getByAutoId('searchBarInput').should('exist').clear()
				.type(inputVal.concat('{enter}'));
			cy.wait(4000);
			cy.get('app-general-search').should('contain', '10 Results for "'.concat(inputVal).concat('"'));
			// cy.get('app-general-search').should('contain', '10 Results for');
			cy.getByAutoId('searchSiteSelect').should('exist');
			cy.getByAutoId('cui-select').should('exist');			// 2 found
			cy.getByAutoId('searchResultLinkPre0').should('exist');
			cy.getByAutoId('searchResultLinkPre1').should('exist');
			cy.getByAutoId('searchResultLinkPre2').should('exist');
			cy.getByAutoId('searchClose').should('exist').click();
		});
	});
});
