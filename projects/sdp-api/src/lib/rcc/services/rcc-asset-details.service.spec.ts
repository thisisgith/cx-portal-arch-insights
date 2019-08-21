import { TestBed } from '@angular/core/testing';

import { RccAssetDetailsService } from './rcc-asset-details.service';

describe('RccAssetDetailsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RccAssetDetailsService = TestBed.get(RccAssetDetailsService);
    expect(service).toBeTruthy();
  });
});
