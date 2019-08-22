/* tslint:disable */
import { TestBed } from '@angular/core/testing';

import { RccService } from './rcc.service';

describe('RccService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RccService = TestBed.get(RccService);
    expect(service).toBeTruthy();
  });
});
