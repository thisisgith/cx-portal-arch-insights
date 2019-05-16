import {
	alertData,
	assetData,
	assetsData,
	searchData,
	solutionATX,
	solutionRacetrack,
} from '@mock';
import { HttpHeaders } from '@angular/common/http';

import {
	AlertResults,
	SearchResults,
} from '@services';

import {
	RacetrackResponse,
	ATXResponse,
} from '@cui-x/sdp-api';

import {
	Asset,
} from '@interfaces';

/**
 * Interface representing a scenario for a Mock test
 */
interface Scenario {
	selected?: boolean;
	description: string;
	delay?: number;
	response: {
		body?: (
			AlertResults |
			Asset | Asset[] |
			SearchResults |
			RacetrackResponse |
			ATXResponse
		);
		headers?: HttpHeaders;
		status: number;
		statusText?: string;
	};
}

/**
 * Interface Representing a mock object
 */
interface Mock {
	url: string;
	scenarios: {
		DELETE?: Scenario[];
		GET?: Scenario[];
		HEAD?: Scenario[];
		POST?: Scenario[];
		PUT?: Scenario[];
	};
}

/**
 * Interface representing our mock settings
 */
interface MockSettings {
	mock: Mock[];
}

/**
 * Our default mock settings
 */
export const mockSettings: MockSettings = {
	mock: [
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: assetsData,
							status: 200,
						},
						selected: true,
					},
				],
			},
			url: '/ws/inventory/hardware',
		},
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: assetData,
							status: 200,
						},
						selected: true,
					},
				],
			},
			url: '/ws/inventory/hardware/1',
		},
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: searchData,
							status: 200,
						},
						selected: true,
					},
					{
						delay: 5000,
						description: 'Empty Response',
						response: {
							body: {
								results: [],
							},
							status: 200,
						},
					},
					{
						delay: 1000,
						description: 'Failure Response',
						response: {
							status: 404,
							statusText: 'Unable to find results',
						},
					},
				],
			},
			url: '/ws/search',
		},
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: solutionATX,
							status: 200,
						},
						selected: true,
					},
				],
			},
			url: '/api/customerportal/racetrack/v1/atx?' +
			'usecase=Wireless Assurance&solution=ibn&pitstop=Onboard&customerId=2431199',
		},
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: alertData,
							status: 200,
						},
						selected: true,
					},
				],
			},
			url: '/ws/alert',
		},
		{
			scenarios: {
				GET: [
					{
						delay: 500,
						description: 'Generic Example',
						response: {
							body: solutionRacetrack,
							status: 200,
						},
						selected: true,
					},
				],
			},
			url: '/api/customerportal/pitstop/v1/info?customerId=2431199',
		},
	],
};
