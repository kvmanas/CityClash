import { TestBed } from '@angular/core/testing';

import { VillageService } from './village.service';

describe('VillageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VillageService = TestBed.get(VillageService);
    expect(service).toBeTruthy();
  });
});
