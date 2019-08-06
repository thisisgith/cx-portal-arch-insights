import { Injectable } from '@angular/core';
import { UtilsService } from '@services';

/**
 * The IE Setup Wizard State Interface
 */
export interface IESetupWizardState {
	collectorIP?: string;
	collectorToken?: string;
	compKey?: number;
	ovaSelection?;
	deployStepsSet?: string;
}

/**
 * Key for referencing localStorage object
 */
const IE_SETUP_STATE_LS_KEY = 'cxportal.cisco.com::IE_SETUP_STATE';

/**
 * Service that stores state for the IE Setup wizard
 */
@Injectable({
	providedIn: 'root',
})
export class SetupIEStateService {
	private _compKey: number;
	private _collectorIP: string;
	private _collectorToken: string;
	private _ovaSelection;
	private _deployStepsSet: string;
	private _noState: boolean;

	constructor (
		private utils: UtilsService,
	) {
		this.setStateFromLocalStorage();
	}

	/**
	 * Applies IESetupWizardState to service props
	 * @param state {IESetupWizardState}
	 */
	private _setState (state: IESetupWizardState) {
		this._noState = Boolean(!state);
		if (!this._noState) {
			this._compKey = state.compKey;
			this._deployStepsSet = state.deployStepsSet;
			this._ovaSelection = state.ovaSelection;
			this._collectorIP = state.collectorIP;
			this._collectorToken = state.collectorToken;
		}
	}

	/**
	 * Sets the state of the IE Setup Wizard
	 * @param state {IESetupWizardState}
	 */
	public setState (state: IESetupWizardState) {
		this._setState(state);
		this.utils.setLocalStorage(IE_SETUP_STATE_LS_KEY, state);
	}

	/**
	 * Sets the state from object stored in local storage
	 */
	public setStateFromLocalStorage () {
		const state = this.utils.getLocalStorage(IE_SETUP_STATE_LS_KEY);
		this._setState(state);
	}

	/**
	 * Gets the state of the IE Setup Wizard
	 * @returns state {IESetupWizardState}
	 */
	public getState (): IESetupWizardState {
		return this._noState ? null : {
			collectorIP: this._collectorIP,
			collectorToken: this._collectorToken,
			compKey: this._compKey,
			deployStepsSet: this._deployStepsSet,
			ovaSelection: this._ovaSelection,
		};
	}

	/**
	 * Removes the IE Setup Wizard state from localStorage
	 */
	public clearState () {
		localStorage.removeItem(IE_SETUP_STATE_LS_KEY);
	}
}
