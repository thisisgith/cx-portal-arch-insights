// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const wp = require('@cypress/webpack-preprocessor');
const webpackOptions = require('../webpack.config');

module.exports = on => {
	on('task', {
		/**
		 * Set a value in a global node variable
		 * @param { object } args Name and value of the variable to set
		 * @returns { boolean } Resolves once the value has been set
		 */
		setVar ({ name, value }) {
			global[name] = value;

			return true;
		},
	});
	on('task', {
		/**
		 * Get a value from a global node variable
		 * @param {string} name Name of the variable to get
		 * @returns {string} Value of the variable if found, otherwise false
		 */
		getVar (name) {
			return global[name] ? global[name] : false;
		},
	});

	on('file:preprocessor', wp({ webpackOptions }));
};
