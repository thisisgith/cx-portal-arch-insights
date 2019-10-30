import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetTaggingComponent } from './asset-tagging.component';

describe('AssetTaggingComponent', () => {
	let component: AssetTaggingComponent;
	let fixture: ComponentFixture<AssetTaggingComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AssetTaggingComponent],
		})
	.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AssetTaggingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component)
		.toBeTruthy();
	});
});
