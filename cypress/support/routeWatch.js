/**
 * A class that watches a given route and keeps track of useful metrics
 */
class RouteWatch {
	/**
	 * Constructor
	 * @param {string | Glob | RegExp} route URL argument for cy.route()
	 * @param {string} [method] HTTP request method (default = 'GET')
	 */
	constructor (route, method = 'GET') {
		/**
		 * Number of times a route was called
		 */
		this.called = 0;
		/**
		 * True if the XHR was aborted
		 */
		this.cancelled = false;
		/**
		 * HTTP request method
		 */
		this.method = '';
		/**
		 * XHR response object
		 */
		this.response = {};
		/**
		 * Number of responses received from all requests
		 */
		this.responses = 0;
		/**
		 * XHR request object
		 */
		this.request = {};
		/**
		 * HTTP status code
		 */
		this.status = 0;
		/**
		 * True if the XHR was stubbed
		 */
		this.stubbed = false;

		/**
		 * A unique ID used to alias the route
		 */
		this.alias = `watch-${new Date().getTime()}`;

		cy.server();
		cy.route({
			method,
			url: route,
			onAbort: () => { this.cancelled = true; },
			onRequest: xhr => {
				this.called += 1;
				this.method = xhr.method;
				this.stubbed = xhr.stubbed;
				this.request = xhr.request;
			},
			onResponse: xhr => {
				this.responses += 1;
				this.status = xhr.status;
				this.response = xhr.response;
			},
		}).as(this.alias);
	}

	/**
	 * Wait on the route request+response up to a specific timeout (30s by default)
	 * @param {number} [timeout] Timeout in ms
	 * @returns {Object} XHR request + response
	 */
	wait (timeout = 30000) {
		return cy.wait(`@${this.alias}`, { timeout });
	}
}

module.exports = RouteWatch;
