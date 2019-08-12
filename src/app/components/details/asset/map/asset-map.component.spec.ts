import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GeoCodeService } from '@services';
import { GeoCodeResponse } from '@interfaces';
import {
	MockAssetSummaryData,
} from '@mock';
import { of } from 'rxjs';
import { AssetMapComponent } from './asset-map.component';
import { AssetMapModule } from './asset-map.module';

describe('AssetMap', () => {
	let component: AssetMapComponent;
	let fixture: ComponentFixture<AssetMapComponent>;
	let service: GeoCodeService;

	const geocode: GeoCodeResponse = {
		type: 'FeatureCollection',
		query: [
			'260',
			'east',
			'tasman',
			'drive',
			'san',
			'jose',
			'ca',
		],
		features: [
			{
				address: '260',
				center: [
					-121.933434,
					37.41309,
				],
				context: [
					{
						id: 'neighborhood.292834',
						text: 'North San Jose',
					},
					{
						id: 'postcode.12910954912570380',
						text: '95134',
					},
					{
						id: 'place.7704339974165690',
						text: 'San Jose',
						wikidata: 'Q16553',
					},
					{
						id: 'region.11319063928738010',
						short_code: 'US-CA',
						text: 'California',
						wikidata: 'Q99',
					},
					{
						id: 'country.9053006287256050',
						short_code: 'us',
						text: 'United States',
						wikidata: 'Q30',
					},
				],
				geometry: {
					coordinates: [
						-121.933434,
						37.41309,
					],
					type: 'Point',
				},
				id: 'address.8841657429063736',
				place_name:
					'260 East Tasman Drive, San Jose, California 95134, United States',
				place_type: [
					'address',
				],
				properties: {
					accuracy: 'point',
				},
				relevance: 1,
				text: 'East Tasman Drive',
				type: 'Feature',
			},
		],
		attribution: 'All rights reserved.',
	};

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AssetMapModule,
				HttpClientTestingModule,
			],
			providers: [
				GeoCodeService,
			],
		})
		.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetMapComponent);
		component = fixture.componentInstance;
		service = TestBed.get(GeoCodeService);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
			.toBeTruthy();
	});

	it('should attempt to geocode the input address', () => {
		const spy = spyOn(service, 'forwardLookup')
			.and
			.returnValue(of(geocode));
		component.assetSummary = MockAssetSummaryData;
		fixture.detectChanges();
		component.ngOnInit();
		fixture.detectChanges();
		expect(spy)
			.toHaveBeenCalled();
		expect(component.center)
			.toEqual(geocode.features[0].center);
		expect(component.marker)
			.toEqual(geocode.features[0]);
		expect(component.loading)
			.toBe(false);
		expect(component.zoom)
			.toEqual([11]);
		expect(component.displayAddress.line1)
			.toEqual(MockAssetSummaryData.installAddress1);
	});
});
