import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { I18n } from '@cisco-ngx/cui-utils';
/**
 * Checks if the password and passwordConf field are equal
 * @param control the FormGroup
 * @returns validity
 */

export function passwordsMatchValidator (control: FormGroup) {
	const password = control.get('password');
	const passwordConf = control.get('passwordConf');
	const errors: {
		doesNotMatch?: { value: string },
	} = { };
	if (password.value !== passwordConf.value) {
		errors.doesNotMatch = { value: I18n.get('_PasswordsDoNotMatch_') };
	}
	if (Object.entries((errors || { })).length) {
		passwordConf.setErrors(errors);

		return errors;
	}

	passwordConf.setErrors(null);

	return null;
}

/**
 * Validator for password criteria
 * @param control - FormControl
 * @returns validity
 */
export function passwordValidator (control: FormControl) {
	const currentValue = control.value;
	if (!currentValue) { return null; }
	const errors: {
		needsLength?: { value: string },
		needsLowercase?: { value: string },
		needsNumber?: { value: string },
		needsSpecialChar?: { value: string },
		needsUppercase?: { value: string },
	} = { };
	if (currentValue.length < 8) {
		errors.needsLength = { value: currentValue };
	}
	if (!/[A-Z]/.test(currentValue)) {
		errors.needsUppercase = { value: currentValue };
	}
	if (!/[a-z]/.test(currentValue)) {
		errors.needsLowercase = { value: currentValue };
	}
	if (!/\d/.test(currentValue)) {
		errors.needsNumber = { value: currentValue };
	}
	if (!/\W/.test(currentValue)) {
		errors.needsSpecialChar = { value: currentValue };
	}
	if (Object.entries((errors || { })).length) {
		// if errors isn't empty, return it
		return errors;
	}

	return null;
}

/**
 * Custom Validator for IP Address
 * @param control {AbstractControl}
 * @returns function
 */
export function validateIpAddress (control: AbstractControl) {
	const error = { value: I18n.get('_InvalidIPAddressError_') };
	const regexMatch = control.value
		&& control.value.match(/(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})/);
	if (!regexMatch) { return error; }
	let hasError = false;
	regexMatch.slice(1, 5)
		.forEach(elem => {
			const num = parseInt(elem, 10);
			if (isNaN(num) || num > 255) { hasError = true; }
		});
	if (hasError) { return error; }

	return null;
}

/**
 * Validator for proxy host criteria
 * @param control - FormControl
 * @returns validity
 */
export function proxyHostValidator (control: FormControl) {
	const currentValue = control.value;
	if (!currentValue) { return null; }
	const errors: {
		invalidCharacters?: { value: string },
	} = { };

	const hostNameRegex = new RegExp('^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)'
		+ '*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$');
	const ipRegex = new RegExp('^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}'
		+ '([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$');

	if (!hostNameRegex.test(currentValue) && !ipRegex.test(currentValue)) {
		errors.invalidCharacters = { value: currentValue };
	}
	if (Object.entries((errors || { })).length) {
		return errors;
	}

	return null;
}

/**
 * Checks if the oldPassword and password field are different
 * @param control the FormGroup
 * @returns validity
 */
export function passwordsOldNewValidator (control: FormGroup) {
	if (!this.accountForm) { return null; }
	const password = this.accountForm.get('password');
	const oldPassword = this.accountForm.get('oldPassword');
	const errors: {
		oldAndNewMatch?: { value: string },
	} = { };
	if (password.value === oldPassword.value) {
		errors.oldAndNewMatch = { value: I18n.get('_OldPasswordAndNewPasswordMustBeDifferent_') };
	}
	if (Object.entries((errors || { })).length) {
		control.setErrors(errors);

		return errors;
	}

	control.setErrors(null);

	return null;
}
