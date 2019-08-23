import { TestBed } from '@angular/core/testing';

import { DetailsPanelService } from './details-panel.service';

describe('DetailsPanelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DetailsPanelService = TestBed.get(DetailsPanelService);
    expect(service).toBeTruthy();
  });
});
