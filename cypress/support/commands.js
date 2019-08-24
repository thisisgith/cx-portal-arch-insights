/**
 * For dropzone drag drop file upload, from https://www.npmjs.com/package/cypress-file-upload
 */
import 'cypress-file-upload';
/**
* Launches the app under test
*/
Cypress.Commands.add('loadApp', (path = '/') => {
	cy.visit(`pbc${path}`);
});

/**
 * Waits for the specified loading property in the app to be set to false (finished loading)
 * @param {String} property - Property to check to be set to false
 * @param {Integer} timeout - Time in milliseconds to wait before failing
 */
Cypress.Commands.add('waitForAppLoading', (property = 'loading', timeout = 30000) => {
	Cypress.log({
		name: 'loading',
		message: { property, timeout },
	});
	cy.window({ timeout, log: false }).should('have.property', property, false);
});

/**
 * Logs in via Cisco SSO and sets an ObSSOCookie for all future requests.
 * Expects CYPRESS_USERNAME and CYPRESS_PASSWORD environment variables to be defined.
 * You probably also want to whitelist this cookie if you want it to persist across tests,
 * see https://docs.cypress.io/api/cypress-api/cookies.html#Defaults
 */
Cypress.Commands.add('login', () => {
	cy.task('getVar', 'ObSSOCookie').then(cookie => {
		if (cookie) {
			cy.setCookie('ObSSOCookie', cookie);
			return;
		}

		const options = {
			method: 'POST',
			url: 'https://sso-test.cisco.com/autho/login/loginaction.html',
			form: true,
			body: {
				userid: Cypress.env('USERNAME'),
				password: Cypress.env('PASSWORD'),
			},
		};
		cy.request(options).then(res => {
			try {
				expect(res.status).to.equal(200);
			} catch (err) {
				throw new Error(
					`Expected SSO server to return status code 200, got ${res.status} instead`
				);
			}
			try {
				expect(res.headers).to.have.property('set-cookie');
			} catch (err) {
				throw new Error('SSO server did not return a cookie for us to set. Make sure you have CYPRESS_USERNAME and CYPRESS_PASSWORD environment variables set with valid user credentials.');
			}
			res.headers['set-cookie'].forEach(setCookie => {
				if (setCookie.includes('ObSSOCookie=')) {
					const value = setCookie.split(/=([^;]+);/)[1];
					cy.task('setVar', { name: 'ObSSOCookie', value });
				}
			});
		});
	});
});

/**
 * Similar to cy.children() but finds any descendants of the parent element instead of only
 *  immediately following children.
 * @param {Object} subject - The parent DOM element yielded by a preceding command
 * @param {String} selector - The selector of the descendant elements
 * @yields {Object} - The matching descedant element
 * @example
 * cy.get('div').descendants('a') - Yields an <a> element nested anywhere inside of a <div>
 */
Cypress.Commands.add('descendants', { prevSubject: true }, (subject, selector) => {
	cy.wrap(subject).within(() => cy.get(selector)).then(newSubject => {
		cy.root().then(() => newSubject);
	});
});

/**
* Gets an element using it's data-auto-id attribute.
* @param {String} id - The data-auto-id attribute's value used to locate an element
* @param {Object} [options] - Additional options to pass to cy.get()
*/
Cypress.Commands.add('getByAutoId', (id, options) => cy.get(`[data-auto-id="${id}"]`, options));

/**
 * Hovers over an element
 * @yields {Object} - The hovered element
 * @example
 * cy.get('button').hover()
 */
Cypress.Commands.add('hover', { prevSubject: true }, subject => {
	Cypress.log({ name: 'hover' });
	cy.wrap(subject, { log: false }).trigger('mouseover', { log: false });
});

/**
 * Waits for a mock request/response if given.
 * If a time interval or route alias is given, this calls the original cy.wait()
 * @param {Function} originalFn - Reference to the default cy.wait()
 * @param {Object} subject - The previous subject if chained
 * @param {int | String} waitTarget - The target to wait for
 * @param {Object} options - Options for wait()
 * @param {Object} [options] - Additional options to pass to cy.wait()
 */
Cypress.Commands.overwrite('wait', (originalFn, subject, waitTarget, options) => {
	// Call Cypress' builtin wait() if this is a time interval or route alias
	if ((Cypress._.isNumber(waitTarget))
		|| (Cypress._.isString(waitTarget) && waitTarget[0] === '@')) {
		return originalFn(subject, waitTarget, options);
	}
	// Otherwise, perform wait()-like functionality for a mock scenario
	Cypress.log({
		name: 'wait',
		message: waitTarget,
	});
	cy.wrap(new Cypress.Promise((resolve, reject) => {
		// Subscribe to the application's mockEvents subject and listen for events
		cy.window({ log: false }).then(win => {
			let sub;
			// Schedule a timeout so we don't wait infinitely
			const waitTime = Cypress._.get(options, 'timeout', 30000);
			const timeout = setTimeout(() => {
				sub.unsubscribe();
				reject(new Error(`No mock was detected for "${waitTarget}" in ${waitTime} ms`));
			}, waitTime);

			sub = win.mockEvents.subscribe(event => {
				// If the event matches the target, stop the timeout and resolve
				if (event.id === waitTarget) {
					clearTimeout(timeout);
					sub.unsubscribe();
					resolve(event);
				}
			});
		});
	}), { log: false });
});
