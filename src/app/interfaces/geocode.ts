import { LngLatLike, LngLatBoundsLike } from 'mapbox-gl';

/**
 * GeoCode feature context type
 */
export interface GeoCodeFeatureContext {
	id?: string;
	short_code?: string;
	text?: string;
	wikidata?: string;
}

/**
 * Base type for a GeoCode feature and parent
 */
export interface GeoCodeFeature {
	[key: string]: any;
	address?: string;
	bbox?: LngLatBoundsLike;
	center: LngLatLike;
	geometry: {
		coordinates?: LngLatLike;
		interpolated?: boolean;
		omitted?: boolean;
		type: string;
	};
	id: string;
	language?: string;
	matching_place_name?: string;
	matching_text?: string;
	place_name: string;
	place_type: string[];
	properties: any;
	relevance: number;
	text: string;
	type: string;
	context: GeoCodeFeatureContext[];
	routable_points?: {
		points?: null | {
			coordinates: LngLatLike;
		}[];
	};
}

/**
 * Response object from mapbox geocode API
 */
export interface GeoCodeResponse {
	type: string;
	query: string[];
	features: GeoCodeFeature[];
	attribution: string;
}

/**
 * Query params for the GeoCode API
 */
export interface GeoCodeParams {
	access_token?: string;
	autocomplete?: boolean;
	bbox?: string;
	country?: string;
	fuzzyMatch?: boolean;
	language?: string;
	limit?: number;
	proximity?: string;
	routing?: boolean;
	types?: string;
}
